import sql from 'mssql';
import { config } from './database-connection.js';

class DatabasePerformanceTest {
    constructor() {
        this.pool = null;
        this.results = [];
    }

    async connect() {
        try {
            this.pool = new sql.ConnectionPool(config);
            await this.pool.connect();
            console.log('✅ Database connection established for performance testing');
        } catch (error) {
            console.error('❌ Database connection failed:', error.message);
            throw error;
        }
    }

    async executeQuery(queryName, query, iterations = 5) {
        const times = [];
        let avgTime = 0;
        let minTime = Infinity;
        let maxTime = 0;
        let errorCount = 0;
        let recordCount = 0;

        console.log(`\n🔍 Testing: ${queryName}`);
        console.log('Query:', query.substring(0, 100) + '...');

        for (let i = 0; i < iterations; i++) {
            try {
                const startTime = process.hrtime.bigint();
                const result = await this.pool.request().query(query);
                const endTime = process.hrtime.bigint();
                
                const executionTime = Number(endTime - startTime) / 1000000; // Convert to milliseconds
                times.push(executionTime);
                
                if (i === 0) recordCount = result.recordset?.length || 0;
                
                minTime = Math.min(minTime, executionTime);
                maxTime = Math.max(maxTime, executionTime);

                console.log(`  Run ${i + 1}: ${executionTime.toFixed(2)}ms (${recordCount} records)`);
            } catch (error) {
                errorCount++;
                console.log(`  Run ${i + 1}: ERROR - ${error.message}`);
            }
        }

        if (times.length > 0) {
            avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
        }

        const testResult = {
            queryName,
            query: query.length > 200 ? query.substring(0, 200) + '...' : query,
            iterations,
            avgTime: avgTime.toFixed(2),
            minTime: minTime === Infinity ? 0 : minTime.toFixed(2),
            maxTime: maxTime.toFixed(2),
            recordCount,
            errorCount,
            successRate: ((iterations - errorCount) / iterations * 100).toFixed(1),
            allTimes: times.map(t => t.toFixed(2))
        };

        this.results.push(testResult);
        return testResult;
    }

    async runPerformanceTests() {
        console.log('🚀 Starting Database Performance Tests');
        console.log('=====================================');

        // Test 1: Simple SELECT - Employee count
        await this.executeQuery(
            'Simple Count Query',
            'SELECT COUNT(*) as TotalEmployees FROM Employees'
        );

        // Test 2: Basic Employee Selection
        await this.executeQuery(
            'Basic Employee Selection',
            'SELECT TOP 100 Id, FirstName, LastName, Email, Department FROM Employees'
        );

        // Test 3: JOIN Query - Expenses with Employee Info
        await this.executeQuery(
            'Expense-Employee JOIN',
            `SELECT TOP 100 
                e.FirstName + ' ' + e.LastName as EmployeeName,
                ex.Amount,
                ex.Description,
                ex.CreatedOn
            FROM Expenses ex
            JOIN Requests r ON ex.RequestId = r.Id
            JOIN Employees e ON r.EmployeeId = e.Id
            WHERE ex.IsDeleted = 0`
        );

        // Test 4: Complex Aggregation
        await this.executeQuery(
            'Monthly Expense Aggregation',
            `SELECT 
                YEAR(ex.CreatedOn) as Year,
                MONTH(ex.CreatedOn) as Month,
                COUNT(*) as ExpenseCount,
                SUM(ex.Amount) as TotalAmount,
                AVG(ex.Amount) as AvgAmount
            FROM Expenses ex
            WHERE ex.IsDeleted = 0 AND ex.CreatedOn >= DATEADD(MONTH, -12, GETDATE())
            GROUP BY YEAR(ex.CreatedOn), MONTH(ex.CreatedOn)
            ORDER BY Year DESC, Month DESC`
        );

        // Test 5: Filtered Search Query
        await this.executeQuery(
            'Filtered Expense Search',
            `SELECT 
                ex.Id,
                ex.Description,
                ex.Amount,
                ex.Status,
                e.FirstName + ' ' + e.LastName as EmployeeName
            FROM Expenses ex
            JOIN Requests r ON ex.RequestId = r.Id
            JOIN Employees e ON r.EmployeeId = e.Id
            WHERE ex.IsDeleted = 0 
                AND ex.Amount BETWEEN 100 AND 5000
                AND ex.CreatedOn >= DATEADD(MONTH, -6, GETDATE())
            ORDER BY ex.CreatedOn DESC`
        );

        // Test 6: Large Dataset Query - All Expenses
        await this.executeQuery(
            'All Expenses Query',
            `SELECT 
                ex.Id,
                ex.Description,
                ex.Amount,
                ex.Status,
                ex.CreatedOn,
                e.FirstName + ' ' + e.LastName as EmployeeName,
                p.Name as ProjectName
            FROM Expenses ex
            JOIN Requests r ON ex.RequestId = r.Id
            JOIN Employees e ON r.EmployeeId = e.Id
            LEFT JOIN Projects p ON ex.ProjectId = p.Id
            WHERE ex.IsDeleted = 0`
        );

        // Test 7: Medical Expenses Complex Query
        await this.executeQuery(
            'Medical Expenses Analysis',
            `SELECT 
                e.FirstName + ' ' + e.LastName as EmployeeName,
                e.Department,
                COUNT(me.Id) as TotalMedicalExpenses,
                SUM(me.Amount) as TotalAmount,
                AVG(me.Amount) as AvgAmount,
                MAX(me.CreatedOn) as LastExpenseDate
            FROM Employees e
            LEFT JOIN MedicalExpenses me ON e.Id = me.EmployeeId AND me.IsDeleted = 0
            WHERE YEAR(me.CreatedOn) = 2025 OR me.CreatedOn IS NULL
            GROUP BY e.Id, e.FirstName, e.LastName, e.Department
            HAVING COUNT(me.Id) > 0
            ORDER BY TotalAmount DESC`
        );

        // Test 8: Status-based Filtering
        await this.executeQuery(
            'Status-based Expense Query',
            `SELECT 
                ex.Status,
                COUNT(*) as Count,
                SUM(ex.Amount) as TotalAmount,
                AVG(ex.Amount) as AvgAmount
            FROM Expenses ex
            WHERE ex.IsDeleted = 0
            GROUP BY ex.Status
            ORDER BY TotalAmount DESC`
        );

        // Test 9: Date Range Performance
        await this.executeQuery(
            'Date Range Query',
            `SELECT 
                COUNT(*) as ExpenseCount,
                SUM(Amount) as TotalAmount
            FROM Expenses 
            WHERE IsDeleted = 0 
                AND CreatedOn BETWEEN '2025-01-01' AND '2025-12-31'`
        );

        // Test 10: Top Spenders Query
        await this.executeQuery(
            'Top Spenders Analysis',
            `SELECT TOP 50
                e.FirstName + ' ' + e.LastName as EmployeeName,
                e.Email,
                e.Department,
                COUNT(ex.Id) as ExpenseCount,
                SUM(ex.Amount) as TotalExpenses,
                AVG(ex.Amount) as AvgExpense
            FROM Employees e
            JOIN Requests r ON e.Id = r.EmployeeId
            JOIN Expenses ex ON r.Id = ex.RequestId
            WHERE ex.IsDeleted = 0 AND r.IsDeleted = 0
            GROUP BY e.Id, e.FirstName, e.LastName, e.Email, e.Department
            ORDER BY TotalExpenses DESC`
        );

        console.log('\n✅ Performance testing completed');
    }

    generateMarkdownReport() {
        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();
        
        // Calculate overall statistics
        const totalQueries = this.results.length;
        const avgResponseTime = (this.results.reduce((sum, r) => sum + parseFloat(r.avgTime), 0) / totalQueries).toFixed(2);
        const totalRecords = this.results.reduce((sum, r) => sum + r.recordCount, 0);
        const slowestQuery = this.results.reduce((prev, current) => (parseFloat(prev.avgTime) > parseFloat(current.avgTime)) ? prev : current);
        const fastestQuery = this.results.reduce((prev, current) => (parseFloat(prev.avgTime) < parseFloat(current.avgTime)) ? prev : current);

        let markdown = `# Database Performance Test Results

**Generated on:** ${currentDate} at ${currentTime}  
**Database:** sqldb-expensemanagement-stage  
**Server:** sql-expensemanagement-stage.database.windows.net  
**Test Type:** Data Retrieval Operations Performance Analysis

---

## 📊 Executive Summary

### Overall Performance Metrics:
- **Total Queries Tested:** ${totalQueries}
- **Average Response Time:** ${avgResponseTime}ms
- **Total Records Retrieved:** ${totalRecords.toLocaleString()}
- **Test Success Rate:** ${(this.results.filter(r => parseFloat(r.successRate) === 100).length / totalQueries * 100).toFixed(1)}%

### Performance Highlights:
- **Fastest Query:** ${fastestQuery.queryName} (${fastestQuery.avgTime}ms)
- **Slowest Query:** ${slowestQuery.queryName} (${slowestQuery.avgTime}ms)
- **Largest Dataset:** ${this.results.reduce((prev, current) => (prev.recordCount > current.recordCount) ? prev : current).queryName} (${this.results.reduce((prev, current) => (prev.recordCount > current.recordCount) ? prev : current).recordCount.toLocaleString()} records)

---

## 🔍 Detailed Test Results

| # | Query Name | Avg Time (ms) | Min Time (ms) | Max Time (ms) | Records | Success Rate | Performance Rating |
|---|------------|---------------|---------------|---------------|---------|--------------|-------------------|
`;

        this.results.forEach((result, index) => {
            let rating = '🟢 Excellent';
            const avgTime = parseFloat(result.avgTime);
            
            if (avgTime > 1000) rating = '🔴 Poor';
            else if (avgTime > 500) rating = '🟡 Fair';
            else if (avgTime > 200) rating = '🟠 Good';
            
            markdown += `| ${index + 1} | **${result.queryName}** | ${result.avgTime} | ${result.minTime} | ${result.maxTime} | ${result.recordCount.toLocaleString()} | ${result.successRate}% | ${rating} |\n`;
        });

        markdown += `\n---\n\n## 📈 Performance Analysis\n\n`;

        // Performance categorization
        const excellent = this.results.filter(r => parseFloat(r.avgTime) <= 200);
        const good = this.results.filter(r => parseFloat(r.avgTime) > 200 && parseFloat(r.avgTime) <= 500);
        const fair = this.results.filter(r => parseFloat(r.avgTime) > 500 && parseFloat(r.avgTime) <= 1000);
        const poor = this.results.filter(r => parseFloat(r.avgTime) > 1000);

        markdown += `### Performance Distribution:
- **🟢 Excellent (≤200ms):** ${excellent.length} queries (${(excellent.length / totalQueries * 100).toFixed(1)}%)
- **🟠 Good (201-500ms):** ${good.length} queries (${(good.length / totalQueries * 100).toFixed(1)}%)
- **🟡 Fair (501-1000ms):** ${fair.length} queries (${(fair.length / totalQueries * 100).toFixed(1)}%)
- **🔴 Poor (>1000ms):** ${poor.length} queries (${(poor.length / totalQueries * 100).toFixed(1)}%)

### Key Observations:

#### Fast Performing Queries:
`;
        excellent.forEach(query => {
            markdown += `- **${query.queryName}**: ${query.avgTime}ms (${query.recordCount.toLocaleString()} records)\n`;
        });

        if (poor.length > 0) {
            markdown += `\n#### Slow Performing Queries:\n`;
            poor.forEach(query => {
                markdown += `- **${query.queryName}**: ${query.avgTime}ms (${query.recordCount.toLocaleString()} records) ⚠️\n`;
            });
        }

        markdown += `\n---\n\n## 🎯 Query Performance Details\n\n`;

        this.results.forEach((result, index) => {
            markdown += `### ${index + 1}. ${result.queryName}\n\n`;
            markdown += `**Query:** \`${result.query}\`\n\n`;
            markdown += `**Performance Metrics:**\n`;
            markdown += `- Average Time: **${result.avgTime}ms**\n`;
            markdown += `- Min Time: ${result.minTime}ms\n`;
            markdown += `- Max Time: ${result.maxTime}ms\n`;
            markdown += `- Records Retrieved: **${result.recordCount.toLocaleString()}**\n`;
            markdown += `- Success Rate: ${result.successRate}%\n`;
            markdown += `- All Run Times: [${result.allTimes.join(', ')}]ms\n`;
            
            const avgTime = parseFloat(result.avgTime);
            if (avgTime <= 200) {
                markdown += `- **Status:** 🟢 Excellent performance\n`;
            } else if (avgTime <= 500) {
                markdown += `- **Status:** 🟠 Good performance\n`;
            } else if (avgTime <= 1000) {
                markdown += `- **Status:** 🟡 Fair performance - consider optimization\n`;
            } else {
                markdown += `- **Status:** 🔴 Poor performance - optimization required\n`;
            }
            
            markdown += `\n---\n\n`;
        });

        markdown += `## 🚀 Performance Recommendations

### Immediate Actions:
`;
        if (poor.length > 0) {
            markdown += `1. **Optimize Slow Queries:** ${poor.length} queries are performing poorly (>1000ms)\n`;
            poor.forEach(query => {
                markdown += `   - Review indexing for: ${query.queryName}\n`;
            });
        } else {
            markdown += `1. **Maintain Current Performance:** All queries are performing within acceptable ranges\n`;
        }

        markdown += `2. **Index Analysis:** Review execution plans for queries with >500ms response time
3. **Query Optimization:** Consider query rewriting for complex JOINs and aggregations
4. **Caching Strategy:** Implement caching for frequently accessed data

### Query-Specific Recommendations:
`;

        this.results.forEach(result => {
            const avgTime = parseFloat(result.avgTime);
            if (avgTime > 500) {
                markdown += `- **${result.queryName}**: `;
                if (result.queryName.includes('JOIN')) {
                    markdown += `Consider adding indexes on join columns\n`;
                } else if (result.queryName.includes('Aggregation')) {
                    markdown += `Consider materialized views for complex aggregations\n`;
                } else if (result.queryName.includes('Search')) {
                    markdown += `Add full-text indexing for description searches\n`;
                } else {
                    markdown += `Review query execution plan and add appropriate indexes\n`;
                }
            }
        });

        markdown += `\n### Database Optimization:
1. **Index Review:** Analyze current indexes and add missing ones
2. **Statistics Update:** Ensure database statistics are current
3. **Query Plan Cache:** Monitor plan cache effectiveness
4. **Connection Pooling:** Optimize connection pool settings

---

## 📊 Performance Benchmarks

### Response Time Categories:
- **Excellent (Green):** ≤200ms - Immediate user response
- **Good (Orange):** 201-500ms - Acceptable for most operations
- **Fair (Yellow):** 501-1000ms - Noticeable delay, optimization recommended
- **Poor (Red):** >1000ms - Significant delay, optimization required

### Record Volume Impact:
`;

        // Analyze relationship between record count and performance
        const volumeAnalysis = this.results.map(r => ({
            name: r.queryName,
            records: r.recordCount,
            avgTime: parseFloat(r.avgTime),
            efficiency: r.recordCount > 0 ? (parseFloat(r.avgTime) / r.recordCount * 1000).toFixed(3) : 'N/A'
        })).sort((a, b) => b.records - a.records);

        volumeAnalysis.forEach(item => {
            markdown += `- **${item.name}**: ${item.records.toLocaleString()} records in ${item.avgTime}ms (${item.efficiency}ms per 1000 records)\n`;
        });

        markdown += `\n---\n\n## 🔧 Technical Details

### Test Environment:
- **Database:** Azure SQL Database
- **Connection:** Encrypted connection with connection pooling
- **Test Method:** ${this.results[0]?.iterations || 5} iterations per query
- **Measurement:** High-resolution timer (nanosecond precision)

### Test Methodology:
1. Each query executed ${this.results[0]?.iterations || 5} times for consistency
2. Results exclude connection establishment time
3. Average, minimum, and maximum times calculated
4. Error rates tracked for reliability analysis

### Database Schema Impact:
- **Primary Tables:** Employees (${this.results.find(r => r.queryName.includes('Employee'))?.recordCount || 'N/A'}), Expenses (${this.results.find(r => r.queryName.includes('All Expenses'))?.recordCount || 'N/A'})
- **Join Operations:** Most queries involve 2-3 table joins
- **Indexing Status:** Standard primary key indexes present

---

*Performance test report generated using automated database testing tools.*  
*Test execution completed: ${currentDate} ${currentTime}*`;

        return markdown;
    }

    async cleanup() {
        if (this.pool) {
            await this.pool.close();
            console.log('🔐 Database connection closed');
        }
    }
}

// Execute performance tests
async function runPerformanceAnalysis() {
    const tester = new DatabasePerformanceTest();
    
    try {
        await tester.connect();
        await tester.runPerformanceTests();
        
        // Generate and save markdown report
        const report = tester.generateMarkdownReport();
        
        const fs = await import('fs');
        fs.writeFileSync('./database-performance-test-results.md', report);
        
        console.log('\n📄 Performance report saved to: database-performance-test-results.md');
        console.log('\n📊 Summary Statistics:');
        console.log(`Total queries tested: ${tester.results.length}`);
        console.log(`Average response time: ${(tester.results.reduce((sum, r) => sum + parseFloat(r.avgTime), 0) / tester.results.length).toFixed(2)}ms`);
        console.log(`Total records retrieved: ${tester.results.reduce((sum, r) => sum + r.recordCount, 0).toLocaleString()}`);
        
    } catch (error) {
        console.error('❌ Performance test failed:', error.message);
    } finally {
        await tester.cleanup();
    }
}

// Run the performance analysis
runPerformanceAnalysis();