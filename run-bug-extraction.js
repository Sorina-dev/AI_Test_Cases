#!/usr/bin/env node

const AzureDevOpsBugExtractor = require('./azure-devops-bugs-extractor.js');
const fs = require('fs');

async function runBugExtraction() {
  try {
    // Load configuration
    const configPath = './azure-devops-config.json';
    
    if (!fs.existsSync(configPath)) {
      console.error('❌ Configuration file not found: ' + configPath);
      console.log('📝 Please copy azure-devops-config.json and fill in your details:');
      console.log('   - organization: Your Azure DevOps organization name');
      console.log('   - project: Your project name');
      console.log('   - personalAccessToken: Your PAT token');
      process.exit(1);
    }

    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    
    // Validate required configuration
    if (!config.organization || config.organization === 'YOUR_ORGANIZATION_NAME') {
      console.error('❌ Please set your organization name in azure-devops-config.json');
      process.exit(1);
    }
    
    if (!config.project || config.project === 'YOUR_PROJECT_NAME') {
      console.error('❌ Please set your project name in azure-devops-config.json');
      process.exit(1);
    }
    
    if (!config.personalAccessToken || config.personalAccessToken === 'YOUR_PERSONAL_ACCESS_TOKEN') {
      console.error('❌ Please set your Personal Access Token in azure-devops-config.json');
      console.log('ℹ️  How to create a PAT:');
      console.log('   1. Go to https://dev.azure.com/{organization}/_usersSettings/tokens');
      console.log('   2. Click "New Token"');
      console.log('   3. Give it a name and select "Work Items (Read)" scope');
      console.log('   4. Copy the token and paste it in the config file');
      process.exit(1);
    }

    console.log(`🔗 Connecting to Azure DevOps...`);
    console.log(`   Organization: ${config.organization}`);
    console.log(`   Project: ${config.project}`);

    const extractor = new AzureDevOpsBugExtractor(config);

    // Clean up filters (remove empty values)
    const filters = {};
    for (const [key, value] of Object.entries(config.filters || {})) {
      if (value && value.trim() !== '') {
        filters[key] = value.trim();
      }
    }

    console.log('🔍 Applied filters:', Object.keys(filters).length > 0 ? filters : 'None (all bugs)');

    const outputFile = config.outputFile || 'bugs_export.csv';
    const maxResults = config.maxResults || null;
    await extractor.exportBugsToCSV(filters, outputFile, maxResults);

  } catch (error) {
    console.error('💥 Error:', error.message);
    
    if (error.message.includes('401')) {
      console.log('🔐 Authentication failed. Please check:');
      console.log('   - Your Personal Access Token is correct');
      console.log('   - The token has "Work Items (Read)" permissions');
      console.log('   - The token has not expired');
    } else if (error.message.includes('404')) {
      console.log('🔍 Resource not found. Please check:');
      console.log('   - Organization name is correct');
      console.log('   - Project name is correct');
      console.log('   - You have access to the project');
    }
    
    process.exit(1);
  }
}

// Add this to package.json scripts
console.log('🚀 Azure DevOps Bug Extractor');
console.log('================================');

runBugExtraction();