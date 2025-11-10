import { configManager } from './config-manager.js';

/**
 * Test script to verify unified configuration is working properly
 */
async function testConfigurations() {
    console.log('🔧 Testing Unified Configuration Manager...\n');

    try {
        // Test database configuration
        console.log('📊 Database Configuration:');
        const dbConfig = configManager.getDatabaseConfig();
        console.log(`  Server: ${dbConfig.server}`);
        console.log(`  Database: ${dbConfig.database}`);
        console.log(`  Pool Max: ${dbConfig.pool.max}`);
        console.log('  ✅ Database config loaded successfully\n');

        // Test Azure DevOps configuration
        console.log('🔧 Azure DevOps Configuration:');
        const adoConfig = configManager.getAzureDevOpsConfig();
        console.log(`  Organization: ${adoConfig.organization}`);
        console.log(`  Project: ${adoConfig.project}`);
        console.log(`  Max Results: ${adoConfig.maxResults}`);
        console.log('  ✅ Azure DevOps config loaded successfully\n');

        // Test MCP configuration
        console.log('🤖 MCP Server Configuration:');
        const mcpConfig = configManager.getMCPConfig();
        const serverNames = Object.keys(mcpConfig.servers);
        console.log(`  Configured Servers: ${serverNames.join(', ')}`);
        console.log('  ✅ MCP config loaded successfully\n');

        // Test Jira configuration
        console.log('📋 Jira Configuration:');
        const jiraConfig = configManager.getJiraConfig();
        console.log(`  URL: ${jiraConfig.url}`);
        console.log(`  Username: ${jiraConfig.username}`);
        console.log('  ✅ Jira config loaded successfully\n');

        // Test Playwright configuration
        console.log('🎭 Playwright Configuration:');
        const playwrightConfig = configManager.getPlaywrightConfig();
        console.log(`  Test Directory: ${playwrightConfig.testDir}`);
        console.log(`  Base URL: ${playwrightConfig.use.baseURL}`);
        console.log(`  Parallel: ${playwrightConfig.fullyParallel}`);
        console.log('  ✅ Playwright config loaded successfully\n');

        // Test environment-specific configuration
        console.log('🌍 Environment Configuration (Staging):');
        const envConfig = configManager.getEnvironmentConfig('staging');
        console.log(`  Database Server: ${envConfig.database.server}`);
        console.log(`  API Base URL: ${envConfig.api.baseUrl}`);
        console.log('  ✅ Environment config loaded successfully\n');

        // Test project information
        console.log('📦 Project Information:');
        const projectInfo = configManager.getProjectInfo();
        console.log(`  Name: ${projectInfo.name}`);
        console.log(`  Version: ${projectInfo.version}`);
        console.log(`  Author: ${projectInfo.author}`);
        console.log('  ✅ Project info loaded successfully\n');

        // Test VS Code settings export
        console.log('⚙️  Testing VS Code Settings Export:');
        const vscodeSettings = configManager.exportVSCodeSettings();
        console.log(`  MCP Servers: ${Object.keys(vscodeSettings.mcp.servers).length}`);
        console.log(`  Playwright Test Dir: ${vscodeSettings['playwright.testDir']}`);
        console.log('  ✅ VS Code settings export working\n');

        // Test package.json export
        console.log('📋 Testing Package.json Export:');
        const packageJson = configManager.exportPackageJson();
        console.log(`  Package Name: ${packageJson.name}`);
        console.log(`  Scripts: ${Object.keys(packageJson.scripts).length}`);
        console.log('  ✅ Package.json export working\n');

        // Test getConfigFor method
        console.log('🎯 Testing Service-Specific Config Access:');
        const dbConfigDirect = configManager.getConfigFor('database');
        const mcpConfigDirect = configManager.getConfigFor('mcp');
        console.log(`  Database via getConfigFor: ${dbConfigDirect.server}`);
        console.log(`  MCP via getConfigFor: ${Object.keys(mcpConfigDirect.servers).length} servers`);
        console.log('  ✅ Service-specific config access working\n');

        console.log('🎉 All configuration tests passed successfully!');
        console.log('🔧 Unified configuration system is ready to use.');

    } catch (error) {
        console.error('❌ Configuration test failed:', error.message);
        console.error('Stack trace:', error.stack);
        process.exit(1);
    }
}

// Run the test
testConfigurations();