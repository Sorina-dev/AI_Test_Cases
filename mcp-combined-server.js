#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { chromium } from 'playwright';
import sql from 'mssql';
import { configManager } from './config-manager.js';

/**
 * Combined MCP Server for Playwright Automation & SQL Server Database Operations
 * Provides both browser automation and database connectivity for comprehensive testing
 */
class CombinedMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'combined-automation-server',
        version: '1.0.0',
        description: 'MCP Server for Playwright Automation and Database Operations'
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );
    
    // Playwright components
    this.browser = null;
    this.context = null;
    this.page = null;
    
    // Database components
    this.connectionPool = null;
    this.isDbConnected = false;
    
    // Use unified database configuration
    this.dbConfig = configManager.getDatabaseConfig();
    
    this.setupToolHandlers();
  }

  // Database Methods
  async connectToDatabase() {
    if (this.isDbConnected && this.connectionPool) {
      return this.connectionPool;
    }
    
    try {
      this.connectionPool = new sql.ConnectionPool(this.dbConfig);
      await this.connectionPool.connect();
      this.isDbConnected = true;
      console.log('✅ Database connection established');
      return this.connectionPool;
    } catch (error) {
      console.error('❌ Database connection failed:', error.message);
      throw error;
    }
  }

  async executeQuery(query, parameters = {}) {
    try {
      const pool = await this.connectToDatabase();
      const request = pool.request();
      
      for (const [key, value] of Object.entries(parameters)) {
        request.input(key, value);
      }
      
      const result = await request.query(query);
      return result;
    } catch (error) {
      console.error('❌ Query execution failed:', error.message);
      throw error;
    }
  }

  // Playwright Methods
  async initializeBrowser() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
    }
    return this.page;
  }

  async closeBrowser() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // Database Tools
          {
            name: 'db_connect',
            description: 'Test database connection',
            inputSchema: {
              type: 'object',
              properties: {},
              required: [],
            },
          },
          {
            name: 'db_query',
            description: 'Execute a SQL query',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'SQL query to execute',
                },
                parameters: {
                  type: 'object',
                  description: 'Query parameters (optional)',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_expense_data',
            description: 'Get expense data from database',
            inputSchema: {
              type: 'object',
              properties: {
                employeeEmail: {
                  type: 'string',
                  description: 'Employee email to filter expenses',
                },
                status: {
                  type: 'number',
                  description: 'Expense status filter',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum records to return',
                  default: 10,
                },
              },
              required: [],
            },
          },
          // Playwright Tools
          {
            name: 'navigate_to_url',
            description: 'Navigate browser to a specific URL',
            inputSchema: {
              type: 'object',
              properties: {
                url: {
                  type: 'string',
                  description: 'The URL to navigate to',
                },
              },
              required: ['url'],
            },
          },
          {
            name: 'click_element',
            description: 'Click on an element by selector',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the element to click',
                },
              },
              required: ['selector'],
            },
          },
          {
            name: 'fill_input',
            description: 'Fill an input field with text',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'CSS selector for the input field',
                },
                value: {
                  type: 'string',
                  description: 'Text to fill in the input',
                },
              },
              required: ['selector', 'value'],
            },
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name for the screenshot file',
                  default: 'screenshot',
                },
              },
              required: [],
            },
          },
          {
            name: 'get_page_text',
            description: 'Get visible text from the current page',
            inputSchema: {
              type: 'object',
              properties: {
                selector: {
                  type: 'string',
                  description: 'Optional CSS selector to get text from specific element',
                },
              },
              required: [],
            },
          },
          // Combined Tools
          {
            name: 'test_expense_submission',
            description: 'End-to-end test: Submit expense and verify in database',
            inputSchema: {
              type: 'object',
              properties: {
                employeeEmail: {
                  type: 'string',
                  description: 'Employee email for testing',
                },
                expenseAmount: {
                  type: 'number',
                  description: 'Expense amount to submit',
                },
                description: {
                  type: 'string',
                  description: 'Expense description',
                },
              },
              required: ['employeeEmail', 'expenseAmount', 'description'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Database Tool Handlers
          case 'db_connect':
            return await this.handleDbConnect();
          case 'db_query':
            return await this.handleDbQuery(args.query, args.parameters);
          case 'get_expense_data':
            return await this.handleGetExpenseData(args.employeeEmail, args.status, args.limit);
            
          // Playwright Tool Handlers
          case 'navigate_to_url':
            return await this.handleNavigateToUrl(args.url);
          case 'click_element':
            return await this.handleClickElement(args.selector);
          case 'fill_input':
            return await this.handleFillInput(args.selector, args.value);
          case 'take_screenshot':
            return await this.handleTakeScreenshot(args.name);
          case 'get_page_text':
            return await this.handleGetPageText(args.selector);
            
          // Combined Tool Handlers
          case 'test_expense_submission':
            return await this.handleTestExpenseSubmission(args.employeeEmail, args.expenseAmount, args.description);
            
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  // Database Handler Methods
  async handleDbConnect() {
    try {
      const pool = await this.connectToDatabase();
      const result = await this.executeQuery('SELECT @@VERSION as Version, DB_NAME() as DatabaseName');
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Database connection successful!\n\nServer: ${this.dbConfig.server}\nDatabase: ${this.dbConfig.database}\nVersion: ${result.recordset[0].Version}\nCurrent Database: ${result.recordset[0].DatabaseName}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Connection failed: ${error.message}`);
    }
  }

  async handleDbQuery(query, parameters = {}) {
    try {
      const result = await this.executeQuery(query, parameters);
      
      return {
        content: [
          {
            type: 'text',
            text: `Query executed successfully.\n\nRows affected: ${result.rowsAffected}\nRecords returned: ${result.recordset?.length || 0}\n\nResults:\n${JSON.stringify(result.recordset, null, 2)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  async handleGetExpenseData(employeeEmail, status, limit = 10) {
    let whereClause = 'WHERE ex.IsDeleted = 0';
    
    if (employeeEmail) {
      whereClause += ` AND e.Email = '${employeeEmail}'`;
    }
    if (status !== undefined) {
      whereClause += ` AND ex.Status = ${status}`;
    }

    const query = `
      SELECT TOP ${limit}
        ex.Id,
        ex.Description,
        ex.Amount,
        ex.Status,
        ex.CreatedOn,
        e.FirstName + ' ' + e.LastName as EmployeeName,
        e.Email
      FROM Expenses ex
      JOIN Requests r ON ex.RequestId = r.Id
      JOIN Employees e ON r.EmployeeId = e.Id
      ${whereClause}
      ORDER BY ex.CreatedOn DESC
    `;

    const result = await this.executeQuery(query);

    return {
      content: [
        {
          type: 'text',
          text: `💰 Expense Data\n\nFound ${result.recordset.length} expenses:\n\n` +
              result.recordset.map((exp, i) => 
                `${i + 1}. $${exp.Amount?.toFixed(2)} - ${exp.EmployeeName}\n` +
                `   ${exp.Description || 'No description'}\n` +
                `   Status: ${exp.Status} | Date: ${new Date(exp.CreatedOn).toLocaleDateString()}\n`
              ).join('\n'),
        },
      ],
    };
  }

  // Playwright Handler Methods
  async handleNavigateToUrl(url) {
    try {
      const page = await this.initializeBrowser();
      await page.goto(url);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Successfully navigated to: ${url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Navigation failed: ${error.message}`);
    }
  }

  async handleClickElement(selector) {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Navigate to a URL first.');
      }
      
      await this.page.click(selector);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Successfully clicked element: ${selector}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Click failed: ${error.message}`);
    }
  }

  async handleFillInput(selector, value) {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Navigate to a URL first.');
      }
      
      await this.page.fill(selector, value);
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Successfully filled input ${selector} with: ${value}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Fill input failed: ${error.message}`);
    }
  }

  async handleTakeScreenshot(name = 'screenshot') {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Navigate to a URL first.');
      }
      
      const filename = `${name}-${Date.now()}.png`;
      const screenshotPath = `./screenshots/${filename}`;
      
      await this.page.screenshot({ path: screenshotPath });
      
      return {
        content: [
          {
            type: 'text',
            text: `✅ Screenshot saved as: ${screenshotPath}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Screenshot failed: ${error.message}`);
    }
  }

  async handleGetPageText(selector) {
    try {
      if (!this.page) {
        throw new Error('Browser not initialized. Navigate to a URL first.');
      }
      
      let text;
      if (selector) {
        text = await this.page.textContent(selector);
      } else {
        text = await this.page.textContent('body');
      }
      
      return {
        content: [
          {
            type: 'text',
            text: `📄 Page Text:\n\n${text}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Get text failed: ${error.message}`);
    }
  }

  // Combined Handler Methods
  async handleTestExpenseSubmission(employeeEmail, expenseAmount, description) {
    try {
      // Step 1: Navigate to expense app
      const page = await this.initializeBrowser();
      await page.goto('https://app-expensemanagement-stage.azurewebsites.net/');
      
      // Step 2: Check current expenses count in database
      const beforeQuery = `
        SELECT COUNT(*) as ExpenseCount 
        FROM Expenses ex
        JOIN Requests r ON ex.RequestId = r.Id
        JOIN Employees e ON r.EmployeeId = e.Id
        WHERE e.Email = '${employeeEmail}' AND ex.IsDeleted = 0
      `;
      
      const beforeResult = await this.executeQuery(beforeQuery);
      const expensesBefore = beforeResult.recordset[0].ExpenseCount;
      
      // Step 3: Take screenshot before submission
      await this.page.screenshot({ path: `./screenshots/before-submission-${Date.now()}.png` });
      
      // Step 4: Submit expense (basic automation - would need actual form selectors)
      // This is a placeholder for actual expense submission automation
      
      // Step 5: Wait and check database for new expense
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      
      const afterResult = await this.executeQuery(beforeQuery);
      const expensesAfter = afterResult.recordset[0].ExpenseCount;
      
      // Step 6: Take screenshot after submission
      await this.page.screenshot({ path: `./screenshots/after-submission-${Date.now()}.png` });
      
      const success = expensesAfter > expensesBefore;
      
      return {
        content: [
          {
            type: 'text',
            text: `🧪 End-to-End Expense Submission Test\n\n` +
                  `Employee: ${employeeEmail}\n` +
                  `Amount: $${expenseAmount}\n` +
                  `Description: ${description}\n\n` +
                  `Expenses Before: ${expensesBefore}\n` +
                  `Expenses After: ${expensesAfter}\n` +
                  `Test Result: ${success ? '✅ PASSED' : '❌ FAILED'}\n\n` +
                  `Screenshots saved in ./screenshots/`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`E2E test failed: ${error.message}`);
    }
  }

  async cleanup() {
    // Close browser
    await this.closeBrowser();
    
    // Close database connection
    if (this.connectionPool) {
      try {
        await this.connectionPool.close();
        this.isDbConnected = false;
        console.log('🔐 Database connection closed');
      } catch (error) {
        console.error('❌ Error closing database connection:', error.message);
      }
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('🚀 Combined MCP Server started (Playwright + Database)');
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n⏹️  Shutting down Combined MCP Server...');
      await this.cleanup();
      process.exit(0);
    });
  }
}

// Start the server
const server = new CombinedMCPServer();
server.run().catch((error) => {
  console.error('❌ Server startup failed:', error);
  process.exit(1);
});