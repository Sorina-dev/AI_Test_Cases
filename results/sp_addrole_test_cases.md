# Test Cases for sys.sp_addrole Stored Procedure

**Generated on:** November 7, 2025  
**Database:** SQL Server System Stored Procedure  
**Procedure:** `sys.sp_addrole`  
**Purpose:** Adds a new database role to the current database

---

## 📋 Procedure Overview

### Syntax:
```sql
EXEC sys.sp_addrole 
    @rolename = 'role_name',
    @ownername = 'owner_name'
```

### Parameters:
- **@rolename** (nvarchar(128)): Name of the new database role to create
- **@ownername** (nvarchar(128), optional): Name of the database user who will own the role. Defaults to current user if not specified.

### Return Values:
- **0**: Success
- **Non-zero**: Error occurred

---

## ✅ Positive Test Cases

### Test Case 1: Basic Role Creation
**Description:** Create a simple database role with valid parameters
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'TestRole1'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Role created successfully, return code 0
-- Verification: SELECT * FROM sys.database_roles WHERE name = 'TestRole1'
```

**Expected Outcome:** ✅ Success - Role created successfully

---

### Test Case 2: Role Creation with Current User as Owner
**Description:** Create role without specifying owner (defaults to current user)
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'TestRole2'

-- Execute
EXEC sys.sp_addrole @rolename

-- Expected Result: Role created successfully with current user as owner
-- Verification: SELECT r.name, p.name as owner FROM sys.database_roles r 
--               JOIN sys.database_principals p ON r.owning_principal_id = p.principal_id 
--               WHERE r.name = 'TestRole2'
```

**Expected Outcome:** ✅ Success - Role created with current user as owner

---

### Test Case 3: Role with Maximum Length Name
**Description:** Create role with maximum allowed name length (128 characters)
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = REPLICATE('A', 128)
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Role created successfully
-- Verification: SELECT * FROM sys.database_roles WHERE name = @rolename
```

**Expected Outcome:** ✅ Success - Long name role created successfully

---

### Test Case 4: Role with Special Characters
**Description:** Create role with valid special characters in name
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'Test_Role-2025'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Role created successfully
-- Verification: SELECT * FROM sys.database_roles WHERE name = 'Test_Role-2025'
```

**Expected Outcome:** ✅ Success - Role with special characters created

---

### Test Case 5: Role with Different Valid Owner
**Description:** Create role with a specific database user as owner
```sql
-- Prerequisites: Create a test user first
-- CREATE USER TestUser WITHOUT LOGIN

-- Test Data
DECLARE @rolename NVARCHAR(128) = 'TestRole5'
DECLARE @ownername NVARCHAR(128) = 'TestUser'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Role created successfully with specified owner
-- Verification: Check role exists with correct owner
```

**Expected Outcome:** ✅ Success - Role created with specified owner

---

## ❌ Negative Test Cases

### Test Case 6: Duplicate Role Name
**Description:** Attempt to create a role that already exists
```sql
-- Prerequisites: Create initial role
EXEC sys.sp_addrole 'DuplicateRole', 'dbo'

-- Test Data
DECLARE @rolename NVARCHAR(128) = 'DuplicateRole'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Error - Role already exists
-- Error Code: 15023 (User, group, or role already exists)
```

**Expected Outcome:** ❌ Error - "User, group, or role 'DuplicateRole' already exists in the current database"

---

### Test Case 7: NULL Role Name
**Description:** Attempt to create role with NULL name
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = NULL
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Error - Invalid parameter
-- Error Code: 15600 (An invalid parameter was passed)
```

**Expected Outcome:** ❌ Error - "An invalid parameter or option was specified"

---

### Test Case 8: Empty Role Name
**Description:** Attempt to create role with empty string name
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = ''
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Error - Invalid name
-- Error Code: 15600 (An invalid parameter was passed)
```

**Expected Outcome:** ❌ Error - "An invalid parameter or option was specified"

---

### Test Case 9: Invalid Owner Name
**Description:** Attempt to create role with non-existent owner
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'TestRoleInvalidOwner'
DECLARE @ownername NVARCHAR(128) = 'NonExistentUser'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Error - Owner does not exist
-- Error Code: 15007 (User does not exist)
```

**Expected Outcome:** ❌ Error - "User, group, or role 'NonExistentUser' does not exist in the current database"

---

### Test Case 10: Reserved System Role Name
**Description:** Attempt to create role with reserved system name
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'db_owner'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Error - Cannot create system role
-- Error Code: 15023 (Role already exists)
```

**Expected Outcome:** ❌ Error - "User, group, or role 'db_owner' already exists in the current database"

---

## 🔧 Edge Cases

### Test Case 11: Role Name with Leading/Trailing Spaces
**Description:** Create role with spaces around the name
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = ' TestRoleSpaces '
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: May succeed with trimmed name or fail
-- Note: SQL Server behavior may vary by version
```

**Expected Outcome:** ⚠️ Variable - Behavior depends on SQL Server version

---

### Test Case 12: Unicode Characters in Role Name
**Description:** Create role with Unicode/special characters
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = N'TestRole_ñáéíóú_中文'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Should succeed (nvarchar supports Unicode)
-- Verification: Check role exists with Unicode name
```

**Expected Outcome:** ✅ Success - Unicode characters supported

---

### Test Case 13: Role Name Starting with Numbers
**Description:** Create role with name starting with numeric characters
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = '123TestRole'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Should succeed (valid identifier)
-- Verification: Role created successfully
```

**Expected Outcome:** ✅ Success - Numeric prefix allowed

---

### Test Case 14: Role Name with Brackets
**Description:** Create role with bracket characters
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = '[TestRole]'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Should succeed
-- Note: Brackets are valid in SQL Server identifiers
```

**Expected Outcome:** ✅ Success - Brackets are valid identifier characters

---

### Test Case 15: Maximum Length Owner Name
**Description:** Create role with maximum length owner name
```sql
-- Prerequisites: Create user with long name
-- DECLARE @longUserName NVARCHAR(128) = REPLICATE('U', 128)
-- CREATE USER [@longUserName] WITHOUT LOGIN

-- Test Data
DECLARE @rolename NVARCHAR(128) = 'TestRoleLongOwner'
DECLARE @ownername NVARCHAR(128) = REPLICATE('U', 128)

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Success if owner exists, error if not
```

**Expected Outcome:** ⚠️ Conditional - Depends on owner existence

---

### Test Case 16: Role Name with SQL Injection Attempt
**Description:** Attempt SQL injection through role name parameter
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'TestRole''; DROP TABLE Users; --'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Should treat as literal role name (safe)
-- SQL Server stored procedures are generally injection-safe
```

**Expected Outcome:** ✅ Safe - Treated as literal string, no injection

---

## 🧪 Boundary Testing

### Test Case 17: Minimum Valid Role Name
**Description:** Create role with single character name
```sql
-- Test Data
DECLARE @rolename NVARCHAR(128) = 'A'
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: Should succeed
```

**Expected Outcome:** ✅ Success - Single character name valid

---

### Test Case 18: Role Name Exceeding Length
**Description:** Attempt to create role with name longer than 128 characters
```sql
-- Test Data
DECLARE @rolename NVARCHAR(200) = REPLICATE('A', 150)  -- 150 characters
DECLARE @ownername NVARCHAR(128) = 'dbo'

-- Execute
EXEC sys.sp_addrole @rolename, @ownername

-- Expected Result: May truncate or error
-- Note: Parameter is defined as nvarchar(128)
```

**Expected Outcome:** ⚠️ Variable - May truncate or error

---

## 🔍 Verification Queries

### Role Existence Check
```sql
-- Verify role was created
SELECT 
    r.name AS RoleName,
    r.principal_id,
    r.type_desc,
    p.name AS OwnerName,
    r.create_date,
    r.modify_date
FROM sys.database_roles r
LEFT JOIN sys.database_principals p ON r.owning_principal_id = p.principal_id
WHERE r.name = 'YourTestRoleName'
```

### Role Permissions Check
```sql
-- Check role permissions
SELECT 
    dp.permission_name,
    dp.state_desc,
    dp.class_desc,
    OBJECT_NAME(dp.major_id) AS ObjectName
FROM sys.database_permissions dp
JOIN sys.database_principals pr ON dp.grantee_principal_id = pr.principal_id
WHERE pr.name = 'YourTestRoleName'
```

### Cleanup Script
```sql
-- Remove test roles
DROP ROLE IF EXISTS TestRole1
DROP ROLE IF EXISTS TestRole2
DROP ROLE IF EXISTS [TestRole with spaces]
-- Add other test role names as needed
```

---

## 📊 Test Execution Summary

### Expected Results Distribution:
- **Positive Cases:** 5 tests (Should pass ✅)
- **Negative Cases:** 5 tests (Should fail with specific errors ❌)
- **Edge Cases:** 6 tests (Variable outcomes ⚠️)
- **Boundary Cases:** 2 tests (Testing limits 🔍)

### Coverage Areas:
- ✅ Valid parameter combinations
- ❌ Invalid parameters and constraints
- 🔧 Special characters and Unicode
- 📏 Length boundaries
- 🔒 Security considerations
- 🗂️ System role conflicts

---

## 🚨 Test Environment Requirements

### Prerequisites:
1. **Database Access:** Must have `db_securityadmin` or `db_owner` role
2. **Test Database:** Isolated test environment recommended
3. **Cleanup:** Always clean up test roles after testing
4. **Backup:** Ensure database backup before testing

### Security Considerations:
- Test in isolated environment only
- Never run in production
- Clean up all test artifacts
- Monitor for permission escalation

---

*Test cases generated for sys.sp_addrole stored procedure testing.*  
*Last updated: November 7, 2025*