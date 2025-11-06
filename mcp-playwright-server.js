#!/usr/bin/env node

const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const { ListToolsRequestSchema, CallToolRequestSchema } = require('@modelcontextprotocol/sdk/types.js');
const { chromium } = require('playwright');

class PlaywrightMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'playwright-automation',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );
    
    this.browser = null;
    this.context = null;
    this.page = null;
    
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'navigate_to_url',
            description: 'Navigate to a specific URL',
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
                  description: 'CSS selector of the element to click',
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
                  description: 'CSS selector of the input field',
                },
                text: {
                  type: 'string',
                  description: 'Text to fill in the input field',
                },
              },
              required: ['selector', 'text'],
            },
          },
          {
            name: 'take_screenshot',
            description: 'Take a screenshot of the current page',
            inputSchema: {
              type: 'object',
              properties: {
                path: {
                  type: 'string',
                  description: 'Path to save the screenshot',
                  default: 'screenshot.png',
                },
              },
            },
          },
          {
            name: 'get_page_title',
            description: 'Get the title of the current page',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'close_browser',
            description: 'Close the browser',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        await this.ensureBrowserStarted();

        switch (name) {
          case 'navigate_to_url':
            await this.page.goto(args.url);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully navigated to ${args.url}`,
                },
              ],
            };

          case 'click_element':
            await this.page.click(args.selector);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully clicked element: ${args.selector}`,
                },
              ],
            };

          case 'fill_input':
            await this.page.fill(args.selector, args.text);
            return {
              content: [
                {
                  type: 'text',
                  text: `Successfully filled input ${args.selector} with: ${args.text}`,
                },
              ],
            };

          case 'take_screenshot':
            const path = args.path || 'screenshot.png';
            await this.page.screenshot({ path });
            return {
              content: [
                {
                  type: 'text',
                  text: `Screenshot saved to: ${path}`,
                },
              ],
            };

          case 'get_page_title':
            const title = await this.page.title();
            return {
              content: [
                {
                  type: 'text',
                  text: `Page title: ${title}`,
                },
              ],
            };

          case 'close_browser':
            if (this.browser) {
              await this.browser.close();
              this.browser = null;
              this.context = null;
              this.page = null;
            }
            return {
              content: [
                {
                  type: 'text',
                  text: 'Browser closed successfully',
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  async ensureBrowserStarted() {
    if (!this.browser) {
      this.browser = await chromium.launch({ headless: false });
      this.context = await this.browser.newContext();
      this.page = await this.context.newPage();
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Playwright MCP server running on stdio');
  }
}

// Run the server
const server = new PlaywrightMCPServer();
server.run().catch(console.error);