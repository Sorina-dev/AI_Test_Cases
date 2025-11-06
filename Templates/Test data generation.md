# Practical Use Cases for AI-Generated Test Data

  

The following examples demonstrate how AI can be used to generate various types of test data. Each use case includes a sample prompt and the expected output. These examples can be adapted to your specific testing needs.

  

### ✅ Use Case 1: Generate Valid & Invalid Data

  

**Prompt:**

  

> Generate 10 valid and 10 invalid email addresses for form validation testing. Include edge cases like max length and unusual TLDs.

  

**Expected Output:**

  
  

`{   "valid": ["user@example.com", "name+alias@sub.domain.info", ...],   "invalid": ["user@", "email@-domain.com", "email@domain..com", ...] }`

  

* * *

  

### ✅ Use Case 2: Create Realistic User Profiles

  

**Prompt:**

  

> Create 5 realistic user profiles in JSON format with fields: name, email, birthdate, phone, country, accountStatus.

  

**Expected Output:**

  

`[   {     "name": "Anna Petrova",     "email": "anna.petrova@gmail.com",     "birthdate": "1992-07-14",     "phone": "+44 7624 123456",     "country": "UK",     "accountStatus": "Active"   }, ... ]`

  

* * *

  

### ✅ Use Case 3: Edge Case Generator

  

**Prompt:**

  

> Given this API schema for a `userProfile` object, generate edge case values for each field: string lengths, nulls, min/max numbers, invalid formats.

  

* * *

  

### ✅ Use Case 4: Data for E2E Tests in Playwright/API Tests

  

**Prompt:**

  

> I need sample data for a product catalog with 100 products, each having a name, category, price, rating (0–5), and availability flag. Format as CSV.

  

**Use:** Seed database or mock API response.

  

* * *

  

### ✅ Use Case 5: Request-Based Test Data for Manual Testing

  

**Challenge:**

Manual testers often need varied test data for different test cases, but creating this data manually is time-consuming and may miss important test scenarios. Using AI to generate specific test data sets on demand makes manual testing more efficient and thorough.

  

**Prompt:**

> "I need to test a registration form with these fields: username, email, password, phone, date of birth, and country. Generate 10 test cases with test data that covers various scenarios including valid inputs, validation errors, boundary cases, and localization issues."

  

**Expected Output:**

  

| # | Scenario | Username | Email | Password | Phone | Date of Birth | Country | Expected Result |
|---|----------|----------|-------|----------|-------|---------------|---------|-----------------|
| 1 | Valid standard input | johndoe | john.doe@example.com | P@ssw0rd | +1-555-123-4567 | 1990-05-15 | United States | Successful registration |
| 2 | Minimum length values | ab | a@b.co | Pass1! | +1-123-456 | 2005-12-31 | Peru | Successful registration |
| 3 | Maximum length values | usernamewiththirtycharacterslong | verylongemailaddressfortesting@reallylongdomainnamethatisvalid.photography | AVeryL0ngP@$$w0rdWithSpecialChars!123 | +123-456-789-012-345-6789 | 1920-01-01 | United Kingdom | Successful registration |
| 4 | Special characters | user.name_123 | email+filter@example.co.uk | P@$$w0rd! | +44 (020) 1234-5678 | 1985-07-22 | Australia | Successful registration |
| 5 | Empty fields | [empty] | [empty] | [empty] | [empty] | [empty] | [empty] | Validation errors for all fields |
| 6 | Invalid email format | validuser | email@invalid | Password123! | +1-555-123-4567 | 1992-08-17 | Canada | Email validation error |
| 7 | Weak password | stronguser | valid@email.com | password | +49-555-123-456 | 1988-11-03 | Germany | Password strength error |
| 8 | Future date of birth | futurekid | future@example.com | Valid123! | +33-123-456-789 | 2030-01-01 | France | Date of birth validation error |
| 9 | Non-Latin characters | 用户名测试 | email@例子.中国 | пароль123! | +86-123-4567-8901 | 1995-09-28 | China | Test handling of international characters |
| 10 | SQL Injection attempt | admin'; -- | valid@email.com | Pass123! | +1-555-123-4567 | 1991-04-12 | United States | Security validation triggered |
  



**Why This Matters for Manual Testing:**

- Provides ready-to-use test data for different scenarios

- Ensures coverage of edge cases that might be overlooked

- Helps create repeatable test cases with expected results

- Supports international testing without requiring language expertise

- Enables quick exploratory testing with variety of inputs

  

* * *

  

### ✅ Use Case 6: GDPR-safe Anonymization

  

**Prompt:**

  

> Given this customer data CSV, replace all sensitive values (names, emails, phone numbers) with fake but realistic ones while preserving data structure.

  

* * *

  

### ✅ Use Case 7: SQL Insert Statement Generator

  

**Prompt:**

  

> Write 20 `INSERT INTO Orders (...)` SQL statements with fake data for orderId, userId, orderDate, totalAmount, currency. Use random dates in 2023 and values between $10–$500.

  

* * *

  

### ✅ Use Case 8: Referenced Test Data for Relational Models

  

**Prompt:**

  

> Generate test data for these two tables with foreign key relation:  

> `Users(userId, name)`  

> `Orders(orderId, userId, amount)`  

> Make sure each user has 3 orders.

  

* * *

  

### ✅ Use Case 9: Test Management System Data

  

**Prompt:**

> "I'm setting up test cases in our test management system for a user profile management feature. Generate a structured set of 10 test cases with titles, descriptions, steps, expected results, and specific test data values for each test. The feature allows users to update their profile information including name, email, phone, address, notification preferences, and privacy settings."

  

**Expected Output:**

  

| Test Case ID | Title | Description | Pre-conditions | Steps | Test Data | Expected Results | Priority |
|--------------|-------|-------------|----------------|-------|-----------|------------------|----------|
| TC001 | Valid Profile Update | Verify user can update all profile fields with valid values | User is logged in | 1. Navigate to profile page<br>2. Update all fields<br>3. Click Save | Name: "Jane Smith"<br>Email: "jane.smith@example.com"<br>Phone: "+1-555-123-4567"<br>Address: "123 Main St, Portland, OR 97205"<br>Notifications: Email only<br>Privacy: Friends only | All fields updated successfully, confirmation message displayed | High |
| TC002 | Invalid Email Format | Verify system rejects invalid email format | User is logged in | 1. Navigate to profile page<br>2. Enter invalid email<br>3. Click Save | Email: "invalid.email.com" | Error message displayed for email field, other fields unchanged | High |
| TC003 | Maximum Character Limits | Verify fields handle maximum allowed characters | User is logged in | 1. Navigate to profile page<br>2. Enter maximum length values<br>3. Click Save | Name: "John Jacob Jingleheimer Schmidt-Williamson The Third"<br>Address: "Apartment 1234, Building 56, Very Long Street Name Complex, Neighborhood Area, City Name, Region, State, ZIP 12345-6789, Country Name" | All fields accept maximum values and save correctly | Medium |
| TC004 | Special Characters in Fields | Verify system handles special characters properly | User is logged in | 1. Navigate to profile page<br>2. Enter special characters<br>3. Click Save | Name: "O'Brien-Smith"<br>Address: "Apt #123, 456 Main St. (Building A)" | Special characters handled correctly, no validation errors | Medium |
| TC005 | Empty Optional Fields | Verify system accepts empty optional fields | User is logged in | 1. Navigate to profile page<br>2. Clear optional fields<br>3. Leave required fields filled<br>4. Click Save | Phone: [empty]<br>Address: [empty]<br>Name: "John Doe"<br>Email: "john@example.com" | Profile updates successfully with empty optional fields | Medium |
| TC006 | International Phone Format | Verify system accepts various international phone formats | User is logged in | 1. Navigate to profile page<br>2. Enter international phone<br>3. Click Save | Phone: "+44 20 1234 5678" | Phone format accepted and saved correctly | Low |
| TC007 | Changing Email to Existing Email | Verify system prevents duplicate emails | User is logged in | 1. Navigate to profile page<br>2. Change email to one used by another account<br>3. Click Save | Email: "existing@example.com" | Error message indicating email already in use | High |
| TC008 | Cancel Profile Update | Verify cancellation discards changes | User is logged in with modified unsaved fields | 1. Navigate to profile page<br>2. Modify fields<br>3. Click Cancel | Any modified data | Changes discarded, original values retained | Low |
| TC009 | Form Field Validation | Verify real-time validation feedback | User is logged in | 1. Navigate to profile page<br>2. Enter invalid data in each field<br>3. Observe real-time feedback | Email: "not-an-email"<br>Phone: "letters-only" | Immediate validation feedback before submission | Medium |
| TC010 | Cross-Site Scripting Attempt | Verify system sanitizes potential XSS inputs | User is logged in | 1. Navigate to profile page<br>2. Enter script in name field<br>3. Click Save | Name: "<script>alert('XSS')</script>" | Input sanitized, no script execution, error or sanitized value saved | High |

  

**Benefits for Manual Testers:**

* Ready-to-use test cases that can be directly imported into test management tools

* Specific test data values for each test case

* Structured format that follows testing best practices

* Coverage of various testing scenarios from basic validation to security

  

* * *

  

### ✅ Use Case 10: Data-Driven Test Scenarios

  

**Prompt:**

> "I need to create data-driven test scenarios for testing a mortgage calculator with different inputs. The fields are: loan amount, interest rate, loan term (years), property tax, and insurance. Generate 15 different test scenarios with specific values that cover various realistic cases, edge cases, and special situations."

  

**Expected Output:**

  

| # | Scenario Description | Loan Amount | Interest Rate | Term (Years) | Property Tax | Insurance | Expected Monthly Payment | Notes |
|---|---------------------|-------------|--------------|--------------|--------------|-----------|--------------------------|-------|
| 1 | Standard 30-year mortgage | $350,000 | 5.25% | 30 | $3,600/yr | $1,200/yr | $2,293.31 | Baseline case |
| 2 | Low loan amount | $50,000 | 5.00% | 15 | $480/yr | $360/yr | $435.62 | Testing minimum loan amounts |
| 3 | High loan amount | $2,500,000 | 5.50% | 30 | $36,000/yr | $8,400/yr | $17,974.23 | Luxury property scenario |
| 4 | Short term loan | $250,000 | 4.75% | 10 | $2,400/yr | $900/yr | $2,733.76 | Accelerated payment plan |
| 5 | Zero property tax | $300,000 | 5.00% | 30 | $0/yr | $1,100/yr | $1,729.14 | Tax-exempt property |
| 6 | High interest rate | $200,000 | 18.00% | 30 | $1,800/yr | $840/yr | $3,052.48 | Credit risk scenario |
| 7 | Very low interest rate | $400,000 | 2.75% | 30 | $4,200/yr | $1,500/yr | $1,910.13 | Historical low rate |
| 8 | Maximum term | $275,000 | 5.15% | 40 | $2,900/yr | $1,100/yr | $1,567.59 | Extended term option |
| 9 | Minimum down payment | $425,000 | 6.25% | 30 | $5,100/yr | $2,125/yr | $3,147.78 | 3.5% down payment scenario |
| 10 | Large down payment | $150,000 | 4.85% | 15 | $3,000/yr | $1,500/yr | $1,343.75 | 50% down payment scenario |
| 11 | High insurance | $325,000 | 5.00% | 30 | $3,250/yr | $4,800/yr | $2,246.19 | Flood zone property |
| 12 | Refinance scenario | $280,000 | 3.75% | 20 | $3,360/yr | $1,120/yr | $1,900.57 | Refinance from 30-year |
| 13 | Investment property | $375,000 | 6.50% | 30 | $4,500/yr | $2,250/yr | $2,960.22 | Non-primary residence |
| 14 | First-time homebuyer | $225,000 | 4.50% | 30 | $1,800/yr | $900/yr | $1,407.23 | Special program rate |
| 15 | Decimal precision test | $333,333.33 | 5.125% | 25 | $3,333.33/yr | $1,111.11/yr | $2,116.46 | Testing decimal handling |

  

**How This Helps Manual Testing:**

* Provides diverse, realistic scenarios to thoroughly test calculations

* Includes precalculated expected results for verification

* Covers various combinations that might otherwise be missed

* Supports methodical testing across the application's parameter space

  

* * *