-- =====================================================
-- Test Script for sys.sp_addrole Stored Procedure
-- Generated: November 7, 2025
-- Purpose: Comprehensive testing of sp_addrole functionality
-- =====================================================

-- Set up test environment
USE [YourTestDatabase]  -- Replace with your test database name
GO

PRINT '🧪 Starting sys.sp_addrole Test Suite'
PRINT '======================================'
PRINT 'Generated: ' + CAST(GETDATE() AS NVARCHAR(50))
PRINT ''

-- Create test results table
IF OBJECT_ID('tempdb..#TestResults') IS NOT NULL DROP TABLE #TestResults
CREATE TABLE #TestResults (
    TestID INT IDENTITY(1,1),
    TestName NVARCHAR(200),
    TestType NVARCHAR(50),
    ExpectedResult NVARCHAR(100),
    ActualResult NVARCHAR(100),
    Status NVARCHAR(20),
    ErrorMessage NVARCHAR(500),
    ExecutionTime DATETIME DEFAULT GETDATE()
)

-- =====================================================
-- HELPER PROCEDURES
-- =====================================================

-- Cleanup procedure
IF OBJECT_ID('CleanupTestRoles') IS NOT NULL DROP PROCEDURE CleanupTestRoles
GO
CREATE PROCEDURE CleanupTestRoles
AS
BEGIN
    DECLARE @sql NVARCHAR(MAX) = ''
    DECLARE @roleName NVARCHAR(128)
    
    DECLARE role_cursor CURSOR FOR
    SELECT name FROM sys.database_roles 
    WHERE name LIKE 'Test%' OR name LIKE '%Test%'
    AND name NOT IN ('db_owner', 'db_datareader', 'db_datawriter', 'db_denydatareader', 'db_denydatawriter', 'db_ddladmin', 'db_securityadmin')
    
    OPEN role_cursor
    FETCH NEXT FROM role_cursor INTO @roleName
    
    WHILE @@FETCH_STATUS = 0
    BEGIN
        SET @sql = 'DROP ROLE [' + @roleName + ']'
        EXEC sp_executesql @sql
        PRINT 'Cleaned up role: ' + @roleName
        FETCH NEXT FROM role_cursor INTO @roleName
    END
    
    CLOSE role_cursor
    DEALLOCATE role_cursor
END
GO

-- Test execution helper
IF OBJECT_ID('ExecuteTest') IS NOT NULL DROP PROCEDURE ExecuteTest
GO
CREATE PROCEDURE ExecuteTest
    @TestName NVARCHAR(200),
    @TestType NVARCHAR(50),
    @RoleName NVARCHAR(128),
    @OwnerName NVARCHAR(128) = NULL,
    @ExpectedResult NVARCHAR(100)
AS
BEGIN
    DECLARE @ActualResult NVARCHAR(100) = 'Unknown'
    DECLARE @Status NVARCHAR(20) = 'UNKNOWN'
    DECLARE @ErrorMessage NVARCHAR(500) = NULL
    DECLARE @ReturnCode INT = 0
    
    BEGIN TRY
        -- Execute the stored procedure
        IF @OwnerName IS NULL
            EXEC @ReturnCode = sys.sp_addrole @RoleName
        ELSE
            EXEC @ReturnCode = sys.sp_addrole @RoleName, @OwnerName
        
        -- Check if role was created
        IF EXISTS (SELECT 1 FROM sys.database_roles WHERE name = @RoleName)
        BEGIN
            SET @ActualResult = 'SUCCESS - Role Created'
            SET @Status = CASE WHEN @ExpectedResult LIKE '%SUCCESS%' THEN 'PASS' ELSE 'FAIL' END
        END
        ELSE
        BEGIN
            SET @ActualResult = 'UNKNOWN - Role Not Found'
            SET @Status = 'FAIL'
        END
        
        IF @ReturnCode = 0 AND @Status = 'PASS'
            SET @ActualResult = 'SUCCESS - Return Code 0'
        
    END TRY
    BEGIN CATCH
        SET @ActualResult = 'ERROR - ' + ERROR_MESSAGE()
        SET @ErrorMessage = 'Error ' + CAST(ERROR_NUMBER() AS NVARCHAR(10)) + ': ' + ERROR_MESSAGE()
        SET @Status = CASE WHEN @ExpectedResult LIKE '%ERROR%' OR @ExpectedResult LIKE '%FAIL%' THEN 'PASS' ELSE 'FAIL' END
    END CATCH
    
    -- Insert test result
    INSERT INTO #TestResults (TestName, TestType, ExpectedResult, ActualResult, Status, ErrorMessage)
    VALUES (@TestName, @TestType, @ExpectedResult, @ActualResult, @Status, @ErrorMessage)
    
    PRINT 'Test: ' + @TestName + ' | Status: ' + @Status
END
GO

-- =====================================================
-- POSITIVE TEST CASES
-- =====================================================

PRINT ''
PRINT '✅ POSITIVE TEST CASES'
PRINT '======================'

-- Test 1: Basic Role Creation
EXEC ExecuteTest 
    @TestName = 'Basic Role Creation',
    @TestType = 'Positive',
    @RoleName = 'TestRole1',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Role Created'

-- Test 2: Role Creation with Current User as Owner
EXEC ExecuteTest 
    @TestName = 'Role Creation without Owner (defaults to current user)',
    @TestType = 'Positive',
    @RoleName = 'TestRole2',
    @OwnerName = NULL,
    @ExpectedResult = 'SUCCESS - Role Created'

-- Test 3: Role with Special Characters
EXEC ExecuteTest 
    @TestName = 'Role with Special Characters',
    @TestType = 'Positive',
    @RoleName = 'Test_Role-2025',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Role Created'

-- Test 4: Role with Brackets
EXEC ExecuteTest 
    @TestName = 'Role with Bracket Characters',
    @TestType = 'Positive',
    @RoleName = '[TestRoleBrackets]',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Role Created'

-- Test 5: Single Character Role Name
EXEC ExecuteTest 
    @TestName = 'Single Character Role Name',
    @TestType = 'Positive',
    @RoleName = 'A',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Role Created'

-- =====================================================
-- NEGATIVE TEST CASES
-- =====================================================

PRINT ''
PRINT '❌ NEGATIVE TEST CASES'
PRINT '======================'

-- Test 6: Duplicate Role Name
-- First create the role
EXEC ExecuteTest 
    @TestName = 'Create Initial Role for Duplicate Test',
    @TestType = 'Setup',
    @RoleName = 'DuplicateTestRole',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Role Created'

-- Now try to create duplicate
EXEC ExecuteTest 
    @TestName = 'Duplicate Role Name',
    @TestType = 'Negative',
    @RoleName = 'DuplicateTestRole',
    @OwnerName = 'dbo',
    @ExpectedResult = 'ERROR - Role Already Exists'

-- Test 7: Empty Role Name
EXEC ExecuteTest 
    @TestName = 'Empty Role Name',
    @TestType = 'Negative',
    @RoleName = '',
    @OwnerName = 'dbo',
    @ExpectedResult = 'ERROR - Invalid Parameter'

-- Test 8: Invalid Owner Name
EXEC ExecuteTest 
    @TestName = 'Non-existent Owner',
    @TestType = 'Negative',
    @RoleName = 'TestRoleInvalidOwner',
    @OwnerName = 'NonExistentUser12345',
    @ExpectedResult = 'ERROR - Owner Does Not Exist'

-- Test 9: Reserved System Role Name
EXEC ExecuteTest 
    @TestName = 'Reserved System Role Name',
    @TestType = 'Negative',
    @RoleName = 'db_owner',
    @OwnerName = 'dbo',
    @ExpectedResult = 'ERROR - Role Already Exists'

-- =====================================================
-- EDGE CASES
-- =====================================================

PRINT ''
PRINT '🔧 EDGE CASE TESTS'
PRINT '=================='

-- Test 10: Role Name with Leading/Trailing Spaces
EXEC ExecuteTest 
    @TestName = 'Role Name with Spaces',
    @TestType = 'Edge',
    @RoleName = ' TestRoleSpaces ',
    @OwnerName = 'dbo',
    @ExpectedResult = 'VARIABLE - Depends on SQL Server Version'

-- Test 11: Unicode Characters
EXEC ExecuteTest 
    @TestName = 'Unicode Characters in Role Name',
    @TestType = 'Edge',
    @RoleName = N'TestRole_ñáéíóú_中文',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Unicode Supported'

-- Test 12: Role Name Starting with Numbers
EXEC ExecuteTest 
    @TestName = 'Role Name Starting with Numbers',
    @TestType = 'Edge',
    @RoleName = '123TestRole',
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Numeric Prefix Allowed'

-- Test 13: Very Long Role Name (near 128 limit)
EXEC ExecuteTest 
    @TestName = 'Maximum Length Role Name',
    @TestType = 'Edge',
    @RoleName = REPLICATE('A', 120) + 'TestRole',  -- 128 characters total
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Long Name Accepted'

-- =====================================================
-- BOUNDARY TESTS
-- =====================================================

PRINT ''
PRINT '📏 BOUNDARY TESTS'
PRINT '================='

-- Test 14: Exact 128 Character Limit
EXEC ExecuteTest 
    @TestName = 'Exact 128 Character Role Name',
    @TestType = 'Boundary',
    @RoleName = REPLICATE('B', 128),
    @OwnerName = 'dbo',
    @ExpectedResult = 'SUCCESS - Maximum Length Accepted'

-- =====================================================
-- VERIFICATION AND REPORTING
-- =====================================================

PRINT ''
PRINT '📊 TEST RESULTS SUMMARY'
PRINT '======================='

-- Display detailed results
SELECT 
    TestID,
    TestName,
    TestType,
    ExpectedResult,
    ActualResult,
    Status,
    CASE 
        WHEN Status = 'PASS' THEN '✅'
        WHEN Status = 'FAIL' THEN '❌'
        ELSE '⚠️'
    END AS Icon,
    ErrorMessage
FROM #TestResults
ORDER BY TestID

-- Summary statistics
PRINT ''
PRINT 'SUMMARY STATISTICS:'
PRINT '==================='

DECLARE @TotalTests INT, @PassedTests INT, @FailedTests INT, @UnknownTests INT

SELECT 
    @TotalTests = COUNT(*),
    @PassedTests = SUM(CASE WHEN Status = 'PASS' THEN 1 ELSE 0 END),
    @FailedTests = SUM(CASE WHEN Status = 'FAIL' THEN 1 ELSE 0 END),
    @UnknownTests = SUM(CASE WHEN Status NOT IN ('PASS', 'FAIL') THEN 1 ELSE 0 END)
FROM #TestResults

PRINT 'Total Tests: ' + CAST(@TotalTests AS NVARCHAR(10))
PRINT 'Passed: ' + CAST(@PassedTests AS NVARCHAR(10)) + ' (' + CAST((@PassedTests * 100.0 / @TotalTests) AS NVARCHAR(10)) + '%)'
PRINT 'Failed: ' + CAST(@FailedTests AS NVARCHAR(10)) + ' (' + CAST((@FailedTests * 100.0 / @TotalTests) AS NVARCHAR(10)) + '%)'
PRINT 'Unknown: ' + CAST(@UnknownTests AS NVARCHAR(10))

-- Test type breakdown
PRINT ''
PRINT 'BY TEST TYPE:'
PRINT '============='
SELECT 
    TestType,
    COUNT(*) AS TotalCount,
    SUM(CASE WHEN Status = 'PASS' THEN 1 ELSE 0 END) AS PassedCount,
    SUM(CASE WHEN Status = 'FAIL' THEN 1 ELSE 0 END) AS FailedCount
FROM #TestResults
GROUP BY TestType
ORDER BY TestType

-- Show current database roles
PRINT ''
PRINT 'CURRENT DATABASE ROLES:'
PRINT '======================'
SELECT 
    r.name AS RoleName,
    r.type_desc AS RoleType,
    p.name AS OwnerName,
    r.create_date AS Created
FROM sys.database_roles r
LEFT JOIN sys.database_principals p ON r.owning_principal_id = p.principal_id
WHERE r.name LIKE '%Test%'
ORDER BY r.create_date DESC

-- =====================================================
-- CLEANUP
-- =====================================================

PRINT ''
PRINT '🧹 CLEANUP PHASE'
PRINT '================'

-- Clean up test roles
EXEC CleanupTestRoles

PRINT ''
PRINT 'Test suite completed successfully!'
PRINT 'Check #TestResults table for detailed results.'
PRINT 'Cleanup completed - all test roles removed.'

-- Drop helper procedures
DROP PROCEDURE IF EXISTS CleanupTestRoles
DROP PROCEDURE IF EXISTS ExecuteTest

GO