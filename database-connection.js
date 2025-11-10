import sql from 'mssql';
import { configManager } from './config-manager.js';

// Get database configuration from unified config
const config = configManager.getDatabaseConfig();

async function connectToDatabase() {
    try {
        console.log('Connecting to database...');
        
        // Create connection pool
        const pool = new sql.ConnectionPool(config);
        
        // Connect to the database
        await pool.connect();
        
        console.log('✅ Successfully connected to the database!');
        console.log(`Database: ${config.database}`);
        console.log(`Server: ${config.server}`);
        
        // Test query to verify connection
        const result = await pool.request().query('SELECT @@VERSION as Version, DB_NAME() as DatabaseName');
        console.log('\n📊 Database Information:');
        console.log('Version:', result.recordset[0].Version);
        console.log('Database Name:', result.recordset[0].DatabaseName);
        
        // Get table list
        const tables = await pool.request().query(`
            SELECT TABLE_NAME 
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_TYPE = 'BASE TABLE'
            ORDER BY TABLE_NAME
        `);
        
        console.log('\n📋 Available Tables:');
        tables.recordset.forEach(table => {
            console.log(`- ${table.TABLE_NAME}`);
        });
        
        return pool;
        
    } catch (err) {
        console.error('❌ Database connection error:', err.message);
        throw err;
    }
}

async function executeQuery(pool, query) {
    try {
        const result = await pool.request().query(query);
        return result;
    } catch (err) {
        console.error('❌ Query execution error:', err.message);
        throw err;
    }
}

async function main() {
    let pool;
    
    try {
        // Connect to database
        pool = await connectToDatabase();
        
        // Example queries - uncomment as needed
        
        // Get expense records count
        const expenseCount = await executeQuery(pool, 'SELECT COUNT(*) as ExpenseCount FROM Expenses');
        console.log('\n💰 Total Expenses:', expenseCount.recordset[0].ExpenseCount);
        
        // Get recent expenses (if Expenses table exists)
        try {
            const recentExpenses = await executeQuery(pool, `
                SELECT TOP 5 * FROM Expenses 
                ORDER BY CreatedDate DESC
            `);
            console.log('\n📝 Recent Expenses:');
            recentExpenses.recordset.forEach(expense => {
                console.log(`- ID: ${expense.Id}, Amount: ${expense.Amount}, Description: ${expense.Description}`);
            });
        } catch (queryErr) {
            console.log('\n⚠️ Could not fetch recent expenses (table structure may vary)');
        }
        
    } catch (err) {
        console.error('❌ Application error:', err.message);
    } finally {
        // Close connection
        if (pool) {
            try {
                await pool.close();
                console.log('\n🔐 Database connection closed.');
            } catch (closeErr) {
                console.error('❌ Error closing connection:', closeErr.message);
            }
        }
    }
}

// Export functions for use in other modules
export {
    connectToDatabase,
    executeQuery,
    config
};

// Run if called directly
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

if (process.argv[1] === __filename) {
    main();
}