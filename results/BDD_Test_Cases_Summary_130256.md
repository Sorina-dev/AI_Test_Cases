# BDD Test Cases Summary - User Story 130256

## Successfully Created and Linked to Azure DevOps

User Story 130256: "Submit Per Diem Travel Expense" now has **7 comprehensive BDD test cases** created and linked via "Tested By" relationships.

---

## Test Cases Created in Azure DevOps

### TC01: Per Diem Category Selection (ID: 133988)
**Feature:** Per Diem Category Selection  
**Scenarios:**
```gherkin
Scenario: Successfully select Per Diem category
  Given I am logged into the expense management system
  And I have navigated to the "Submit Expense" page
  When I click on the "Other Expenses" dropdown
  Then I should see "Per Diem" as an available category option
  When I select "Per Diem" category
  Then the system should display the per diem expense form
  And the category field should show "Per Diem" as selected

Scenario: Per Diem category appears in alphabetical order
  When I click on the "Other Expenses" dropdown
  Then the expense categories should be displayed in alphabetical order
  And "Per Diem" should appear in its correct alphabetical position

Scenario: Per Diem form inherits existing expense functionality
  Given I have selected "Per Diem" category
  When the per diem form loads
  Then it should inherit standard expense form features
  And it should maintain consistent UI styling with other expense types
```
**AC Coverage:** AC1, AC1a

---

### TC02: Travel Date and Time Input Validation (ID: 133989)
**Feature:** Travel Date and Destination Input  
**Scenarios:**
```gherkin
Scenario: Input valid travel dates and times
  Given I have selected "Per Diem" as the expense category
  When I enter "01/12/2025" as the start date
  And I enter "09:00" as the start time
  And I enter "03/12/2025" as the end date
  And I enter "17:30" as the end time
  And I enter "London, UK" as the outbound destination
  And I enter "Paris, France" as the inbound destination
  Then the system should accept all input values
  And no validation errors should be displayed

Scenario: Validate end date is after start date
  When I enter "03/12/2025" as the start date
  And I enter "01/12/2025" as the end date
  And I click "Calculate Travel Time"
  Then the system should display an error message
  And the error should state "End date must be after start date"

Scenario: Handle same-day travel
  When I enter "01/12/2025" as the start date
  And I enter "09:00" as the start time
  And I enter "01/12/2025" as the end date
  And I enter "18:00" as the end time
  Then the system should accept the same-day travel
  And calculate the duration as "0 days, 9 hours"
```
**AC Coverage:** AC2

---

### TC03: Automatic Travel Time Calculation (ID: 133990)
**Feature:** Travel Duration Calculation  
**Scenarios:**
```gherkin
Scenario: Calculate multi-day travel duration
  When I enter "01/12/2025" as the start date
  And I enter "09:00" as the start time
  And I enter "05/12/2025" as the end date
  And I enter "17:30" as the end time
  Then the system should automatically calculate travel time
  And display "4 days, 8 hours, 30 minutes" as the duration

Scenario: Calculate partial day travel
  When I enter "01/12/2025" as the start date
  And I enter "14:30" as the start time
  And I enter "01/12/2025" as the end date
  And I enter "18:45" as the end time
  Then the system should calculate "0 days, 4 hours, 15 minutes"
  And update the duration automatically when times change

Scenario: Real-time calculation updates
  Given I have entered valid start date and time
  When I change the end date from "03/12/2025" to "04/12/2025"
  Then the calculated duration should update automatically
  And reflect the new time difference immediately
```
**AC Coverage:** AC3

---

### TC04: Supporting Documentation Upload (ID: 133991)
**Feature:** Travel Documentation Upload  
**Scenarios:**
```gherkin
Scenario: Upload valid PDF document
  When I click the "Upload Documents" button
  And I select a PDF file named "travel_approval.pdf" (2MB)
  Then the system should accept the file upload
  And display "travel_approval.pdf" in the uploaded files list
  And show upload status as "Successfully uploaded"

Scenario: Upload multiple supported file types
  When I upload a PDF file "itinerary.pdf"
  And I upload a JPG file "flight_ticket.jpg"
  And I upload a PNG file "hotel_booking.png"
  Then all three files should be uploaded successfully
  And appear in the uploaded documents list

Scenario: Reject unsupported file format
  When I attempt to upload an MP4 file "vacation_video.mp4"
  Then the system should reject the file
  And display error "Unsupported file format. Please upload PDF, JPG, PNG, DOC, or DOCX files only"
```
**AC Coverage:** AC4

---

### TC05: Per Diem Approval Workflow (ID: 133992)
**Feature:** Per Diem Approval Workflow  
**Scenarios:**
```gherkin
Scenario: Submit per diem request for approval
  Given I have completed a per diem expense form
  When I click the "Submit Request" button
  Then the request should be sent to my line manager for approval
  And the request status should change to "Pending Manager Approval"
  And I should receive a confirmation email about submission

Scenario: Line manager approves per diem request
  Given my per diem request is "Pending Manager Approval"
  When my line manager approves the request
  Then the request status should change to "Pending Finance Approval"
  And the request should be routed to the Finance team
  And both I and Finance should receive notification emails

Scenario: Finance team final approval
  Given my per diem request is "Pending Finance Approval"
  When the Finance team approves the request
  Then the request status should change to "Approved"
  And I should receive a final approval notification
  And the expense should be processed for reimbursement
```
**AC Coverage:** AC5

---

### TC06: Form Validation and Error Handling (ID: 133993)
**Feature:** Per Diem Form Validation  
**Scenarios:**
```gherkin
Scenario: Validate required fields on submission
  When I attempt to submit the form without entering travel dates
  Then the system should prevent submission
  And highlight the missing required fields
  And display message "Please complete all required fields before submitting"

Scenario: Real-time validation for date fields
  When I enter an invalid date "32/12/2025"
  And I move focus to the next field
  Then the system should immediately show validation error
  And the error message should be "Please enter a valid date in DD/MM/YYYY format"

Scenario: Handle system errors gracefully
  Given the travel time calculation service is temporarily unavailable
  When I enter valid travel dates and click "Calculate"
  Then the system should display a user-friendly error message
  And provide option to try again or proceed without automatic calculation
```
**AC Coverage:** Cross-cutting validation for all ACs

---

### TC07: Cross-Platform and Browser Compatibility (ID: 133994)
**Feature:** Cross-Platform Per Diem Access  
**Scenarios:**
```gherkin
Scenario: Access per diem form on mobile device
  Given I am using a mobile browser
  When I navigate to the expense submission page
  And select "Per Diem" category
  Then the form should be responsive and usable on mobile
  And all fields should be accessible and properly formatted

Scenario: File upload on mobile device
  Given I am using the per diem form on mobile
  When I tap the "Upload Documents" button
  Then I should be able to select files from my device
  And upload travel documents using the mobile interface

Scenario: Date picker functionality across browsers
  Given I am using the per diem form
  When I click on the start date field
  Then a date picker should appear
  And function correctly regardless of browser type
  And allow easy date selection
```
**AC Coverage:** Cross-platform compatibility for all ACs

---

## Azure DevOps Integration Status

✅ **Successfully Created:** 7 Test Case work items  
✅ **Successfully Linked:** All 7 test cases linked to User Story 130256 via "Tested By" relationships  
✅ **Comprehensive Coverage:** All acceptance criteria (AC1-AC5) covered across test cases  
✅ **BDD Format:** All scenarios written in proper Gherkin syntax  

### Test Case IDs and Links:
- **133988** - TC01: Per Diem Category Selection
- **133989** - TC02: Travel Date and Time Input Validation  
- **133990** - TC03: Automatic Travel Time Calculation
- **133991** - TC04: Supporting Documentation Upload
- **133992** - TC05: Per Diem Approval Workflow
- **133993** - TC06: Form Validation and Error Handling
- **133994** - TC07: Cross-Platform and Browser Compatibility

### User Story Link:
- **130256** - Submit Per Diem Travel Expense (now shows 12+ "Tested By" relationships)

---

## How to View BDD Content in Azure DevOps

1. **Navigate to User Story 130256** in Azure DevOps
2. **Click on "Links" or "Related Work"** to see all linked test cases
3. **Click on any Test Case ID** (133988-133994) to open the test case
4. **View the "Description" field** to see the BDD scenarios
5. **Use "Steps" tab** for detailed test execution steps

The BDD content is stored in the Description field of each test case, formatted with proper Gherkin syntax including Given-When-Then scenarios.

---

## Next Steps for Test Execution

1. **Review each test case** in Azure DevOps to ensure BDD content is visible
2. **Create test data** for each scenario (travel dates, file samples, etc.)
3. **Execute test cases** following the BDD scenarios
4. **Document results** using Azure DevOps test execution features
5. **Link any defects** discovered during testing back to the user story

The comprehensive BDD test suite now provides complete coverage for the Per Diem Travel Expense functionality with proper traceability in Azure DevOps.