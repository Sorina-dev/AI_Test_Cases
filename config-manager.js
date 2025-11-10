import fs from 'fs';
import path from 'path';

// Load the unified configuration
const configPath = path.join(process.cwd(), 'unified-config.json');
const unifiedConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));

/**
 * Unified Configuration Manager
 * Provides access to all application configurations from a single source
 */
class ConfigManager {
  constructor() {
    this.config = unifiedConfig;
  }

  // Database Configuration
  getDatabaseConfig() {
    return this.config.database.mssql;
  }

  // Azure DevOps Configuration
  getAzureDevOpsConfig() {
    return this.config.azureDevOps;
  }

  // Jira Configuration
  getJiraConfig() {
    return this.config.jira.atlassian;
  }

  // MCP Server Configuration
  getMCPConfig() {
    return this.config.mcp;
  }

  // Playwright Configuration
  getPlaywrightConfig() {
    return this.config.playwright;
  }

  // Testing Configuration
  getTestingConfig() {
    return this.config.testing;
  }

  // Environment-specific Configuration
  getEnvironmentConfig(env = 'staging') {
    return this.config.environments[env] || this.config.environments.staging;
  }

  // Scripts Configuration
  getScripts() {
    return this.config.scripts;
  }

  // Project Information
  getProjectInfo() {
    return this.config.projectInfo;
  }

  // CI/CD Configuration
  getCICDConfig() {
    return this.config['ci-cd'];
  }

  // Logging Configuration
  getLoggingConfig() {
    return this.config.logging;
  }

  // Dependencies Configuration
  getDependencies() {
    return this.config.dependencies;
  }

  // Get configuration for specific tool/service
  getConfigFor(service) {
    const serviceMap = {
      'database': () => this.getDatabaseConfig(),
      'mssql': () => this.getDatabaseConfig(),
      'azuredevops': () => this.getAzureDevOpsConfig(),
      'ado': () => this.getAzureDevOpsConfig(),
      'jira': () => this.getJiraConfig(),
      'atlassian': () => this.getJiraConfig(),
      'mcp': () => this.getMCPConfig(),
      'playwright': () => this.getPlaywrightConfig(),
      'testing': () => this.getTestingConfig(),
      'cicd': () => this.getCICDConfig(),
      'logging': () => this.getLoggingConfig(),
      'dependencies': () => this.getDependencies(),
      'project': () => this.getProjectInfo()
    };

    const getter = serviceMap[service.toLowerCase()];
    if (getter) {
      return getter();
    }
    
    throw new Error(`Unknown service: ${service}. Available services: ${Object.keys(serviceMap).join(', ')}`);
  }

  // Export configurations for VS Code settings
  exportVSCodeSettings() {
    return {
      "mcp": this.config.mcp,
      "playwright.testDir": this.config.playwright.testDir,
      "playwright.use.baseURL": this.config.playwright.use.baseURL,
      "files.associations": {
        "*.json": "jsonc"
      }
    };
  }

  // Export package.json compatible format
  exportPackageJson() {
    const config = this.config;
    return {
      "name": config.projectInfo.name.toLowerCase().replace(/\s+/g, '-'),
      "version": config.projectInfo.version,
      "description": config.projectInfo.description,
      "type": "module",
      "main": "index.js",
      "scripts": {
        // Database scripts
        "db:test": "node database-connection.js",
        "db:performance": "node database-performance-test.js",
        
        // Testing scripts
        "test": "npx playwright test",
        "test:ui": "npx playwright test --ui",
        "test:headed": "npx playwright test --headed",
        "test:report": "npx playwright show-report",
        
        // MCP scripts
        "mcp:start": "node mcp-combined-server.js",
        "mcp:playwright": "node mcp-playwright-server.js",
        
        // DevOps scripts
        "devops:bugs": "node run-bug-extraction.js"
      },
      "dependencies": config.dependencies.packages,
      "devDependencies": {
        "@types/node": config.dependencies.packages["@types/node"]
      },
      "repository": config.projectInfo.repository,
      "author": config.projectInfo.author,
      "license": config.projectInfo.license
    };
  }

  // Export Azure DevOps specific config
  exportAzureDevOpsConfig() {
    return this.config.azureDevOps;
  }

  // Export database connection config (for backward compatibility)
  exportDatabaseConnection() {
    const dbConfig = this.getDatabaseConfig();
    return {
      server: dbConfig.server,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      options: dbConfig.options,
      pool: dbConfig.pool
    };
  }
}

// Create singleton instance
const configManager = new ConfigManager();

// Export both the class and instance for different use cases
export { ConfigManager, configManager };

// Export individual configurations for easy importing
export const config = configManager.getDatabaseConfig();
export const azureDevOpsConfig = configManager.getAzureDevOpsConfig();
export const jiraConfig = configManager.getJiraConfig();
export const mcpConfig = configManager.getMCPConfig();
export const playwrightConfig = configManager.getPlaywrightConfig();
export const testingConfig = configManager.getTestingConfig();

// Default export
export default configManager;