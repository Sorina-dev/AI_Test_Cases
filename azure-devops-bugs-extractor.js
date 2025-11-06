#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

class AzureDevOpsBugExtractor {
  constructor(config) {
    this.organization = config.organization;
    this.project = config.project;
    this.personalAccessToken = config.personalAccessToken;
    
    // Handle both old and new Azure DevOps URL formats
    let baseUrl, workItemUrl;
    if (this.organization.includes('.visualstudio.com')) {
      // Old format: amdaris.visualstudio.com
      baseUrl = `https://${this.organization}/${this.project}/_apis/wit/wiql`;
      workItemUrl = `https://${this.organization}/${this.project}/_apis/wit/workitems`;
    } else {
      // New format: dev.azure.com/amdaris
      baseUrl = `https://dev.azure.com/${this.organization}/${this.project}/_apis/wit/wiql`;
      workItemUrl = `https://dev.azure.com/${this.organization}/${this.project}/_apis/wit/workitems`;
    }
    
    this.baseUrl = baseUrl;
    this.workItemUrl = workItemUrl;
  }

  // Create authorization header
  getAuthHeader() {
    const token = Buffer.from(`:${this.personalAccessToken}`).toString('base64');
    return `Basic ${token}`;
  }

  // Execute WIQL query to get bug IDs
  async queryBugs(filter = {}) {
    const wiqlQuery = this.buildWiqlQuery(filter);
    
    const requestOptions = {
      method: 'POST',
      headers: {
        'Authorization': this.getAuthHeader(),
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    return new Promise((resolve, reject) => {
      const req = https.request(this.baseUrl + '?api-version=7.0', requestOptions, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (res.statusCode === 200) {
              resolve(result.workItems.map(item => item.id));
            } else {
              reject(new Error(`API Error: ${res.statusCode} - ${result.message || data}`));
            }
          } catch (e) {
            reject(new Error(`Parse Error: ${e.message}`));
          }
        });
      });

      req.on('error', reject);
      req.write(JSON.stringify({ query: wiqlQuery }));
      req.end();
    });
  }

  // Build WIQL query based on filters
  buildWiqlQuery(filter) {
    let whereClause = `[System.WorkItemType] = 'Bug'`;
    
    if (filter.state) {
      whereClause += ` AND [System.State] = '${filter.state}'`;
    }
    
    if (filter.assignedTo) {
      whereClause += ` AND [System.AssignedTo] = '${filter.assignedTo}'`;
    }
    
    if (filter.area) {
      whereClause += ` AND [System.AreaPath] UNDER '${filter.area}'`;
    }
    
    if (filter.priority) {
      whereClause += ` AND [Microsoft.VSTS.Common.Priority] = ${filter.priority}`;
    }
    
    if (filter.severity) {
      whereClause += ` AND [Microsoft.VSTS.Common.Severity] = '${filter.severity}'`;
    }
    
    if (filter.createdAfter) {
      whereClause += ` AND [System.CreatedDate] >= '${filter.createdAfter}'`;
    }
    
    if (filter.tags) {
      whereClause += ` AND [System.Tags] CONTAINS '${filter.tags}'`;
    }

    return `
      SELECT [System.Id], [System.Title], [System.State], [System.AssignedTo], 
             [System.CreatedDate], [System.ChangedDate], [Microsoft.VSTS.Common.Priority],
             [Microsoft.VSTS.Common.Severity], [System.AreaPath], [System.Tags]
      FROM WorkItems 
      WHERE ${whereClause}
      ORDER BY [System.CreatedDate] DESC
    `;
  }

  // Get detailed work item information with batching for large datasets
  async getWorkItemDetails(workItemIds) {
    if (workItemIds.length === 0) return [];

    const fields = [
      'System.Id', 'System.Title', 'System.State', 'System.AssignedTo',
      'System.CreatedBy', 'System.CreatedDate', 'System.ChangedDate',
      'Microsoft.VSTS.Common.Priority', 'Microsoft.VSTS.Common.Severity',
      'System.AreaPath', 'System.IterationPath', 'System.Tags',
      'System.Description', 'Microsoft.VSTS.TCM.ReproSteps',
      'Microsoft.VSTS.Common.AcceptanceCriteria'
    ];

    // Batch requests to avoid URL length limits and timeout issues
    const batchSize = 100; // Process 100 work items at a time
    const allResults = [];

    for (let i = 0; i < workItemIds.length; i += batchSize) {
      const batch = workItemIds.slice(i, i + batchSize);
      console.log(`📥 Fetching batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(workItemIds.length/batchSize)} (${batch.length} items)...`);
      
      const url = `${this.workItemUrl}?ids=${batch.join(',')}&fields=${fields.join(',')}&api-version=7.0`;

      const requestOptions = {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Accept': 'application/json'
        }
      };

      const batchResults = await new Promise((resolve, reject) => {
        https.get(url, requestOptions, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => {
            try {
              if (res.statusCode === 200) {
                const result = JSON.parse(data);
                resolve(result.value || []);
              } else {
                // Try to parse error response
                let errorMessage = `HTTP ${res.statusCode}`;
                try {
                  const errorResult = JSON.parse(data);
                  errorMessage = errorResult.message || errorMessage;
                } catch (e) {
                  errorMessage = data.substring(0, 200);
                }
                reject(new Error(`API Error: ${errorMessage}`));
              }
            } catch (e) {
              reject(new Error(`Parse Error: ${e.message}. Response: ${data.substring(0, 200)}`));
            }
          });
        }).on('error', reject);
      });

      allResults.push(...batchResults);
      
      // Small delay between batches to be nice to the API
      if (i + batchSize < workItemIds.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return allResults;
  }

  // Convert work items to CSV format
  workItemsToCSV(workItems) {
    const headers = [
      'ID', 'Title', 'State', 'Assigned To', 'Created By', 'Created Date',
      'Changed Date', 'Priority', 'Severity', 'Area Path', 'Iteration Path',
      'Tags', 'Description', 'Repro Steps', 'Acceptance Criteria'
    ];

    let csv = headers.join(',') + '\n';

    for (const item of workItems) {
      const fields = item.fields;
      const row = [
        item.id,
        this.escapeCsvField(fields['System.Title'] || ''),
        this.escapeCsvField(fields['System.State'] || ''),
        this.escapeCsvField(fields['System.AssignedTo']?.displayName || ''),
        this.escapeCsvField(fields['System.CreatedBy']?.displayName || ''),
        this.formatDate(fields['System.CreatedDate']),
        this.formatDate(fields['System.ChangedDate']),
        fields['Microsoft.VSTS.Common.Priority'] || '',
        this.escapeCsvField(fields['Microsoft.VSTS.Common.Severity'] || ''),
        this.escapeCsvField(fields['System.AreaPath'] || ''),
        this.escapeCsvField(fields['System.IterationPath'] || ''),
        this.escapeCsvField(fields['System.Tags'] || ''),
        this.escapeCsvField(this.stripHtml(fields['System.Description'] || '')),
        this.escapeCsvField(this.stripHtml(fields['Microsoft.VSTS.TCM.ReproSteps'] || '')),
        this.escapeCsvField(this.stripHtml(fields['Microsoft.VSTS.Common.AcceptanceCriteria'] || ''))
      ];

      csv += row.join(',') + '\n';
    }

    return csv;
  }

  // Helper function to escape CSV fields
  escapeCsvField(field) {
    if (typeof field !== 'string') return '';
    
    // Remove newlines and carriage returns
    field = field.replace(/[\r\n]/g, ' ');
    
    // Escape quotes and wrap in quotes if contains comma or quote
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      field = '"' + field.replace(/"/g, '""') + '"';
    }
    
    return field;
  }

  // Helper function to strip HTML tags
  stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').trim();
  }

  // Helper function to format dates
  formatDate(dateString) {
    if (!dateString) return '';
    return new Date(dateString).toISOString().split('T')[0];
  }

  // Main export function
  async exportBugsToCSV(filter = {}, outputFile = 'azure_devops_bugs.csv', maxResults = null) {
    try {
      console.log('🔍 Querying Azure DevOps for bugs...');
      let bugIds = await this.queryBugs(filter);
      
      if (bugIds.length === 0) {
        console.log('📭 No bugs found matching the criteria.');
        return null;
      }

      // Apply maxResults limit if specified
      if (maxResults && bugIds.length > maxResults) {
        console.log(`⚠️  Limiting results to first ${maxResults} of ${bugIds.length} found bugs`);
        bugIds = bugIds.slice(0, maxResults);
      }

      console.log(`📋 Processing ${bugIds.length} bugs. Fetching details...`);
      const workItems = await this.getWorkItemDetails(bugIds);
      
      console.log('📊 Converting to CSV format...');
      const csvContent = this.workItemsToCSV(workItems);
      
      console.log(`💾 Saving to ${outputFile}...`);
      fs.writeFileSync(outputFile, csvContent, 'utf8');
      
      console.log(`✅ Successfully exported ${workItems.length} bugs to ${outputFile}`);
      return outputFile;
      
    } catch (error) {
      console.error('❌ Error exporting bugs:', error.message);
      throw error;
    }
  }
}

// Configuration and usage example
async function main() {
  // Configuration - Replace with your actual values
  const config = {
    organization: 'YOUR_ORGANIZATION',        // e.g., 'mycompany'
    project: 'YOUR_PROJECT',                  // e.g., 'MyProject'
    personalAccessToken: 'YOUR_PAT_TOKEN'    // Your Personal Access Token
  };

  const extractor = new AzureDevOpsBugExtractor(config);

  // Example filters - customize as needed
  const filters = {
    // state: 'Active',                    // Active, Resolved, Closed
    // assignedTo: 'user@domain.com',      // Specific user
    // area: 'MyProject\\Web',             // Area path
    // priority: 1,                        // 1, 2, 3, 4
    // severity: '1 - Critical',           // 1 - Critical, 2 - High, 3 - Medium, 4 - Low
    // createdAfter: '2024-01-01',         // YYYY-MM-DD format
    // tags: 'UI'                          // Tag name
  };

  try {
    await extractor.exportBugsToCSV(filters, 'azure_devops_bugs.csv');
  } catch (error) {
    console.error('Failed to export bugs:', error.message);
    process.exit(1);
  }
}

// Export the class for use as a module
module.exports = AzureDevOpsBugExtractor;

// Run main function if this file is executed directly
if (require.main === module) {
  main();
}