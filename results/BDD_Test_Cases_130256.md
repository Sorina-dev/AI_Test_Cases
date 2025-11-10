# BDD Test Cases - User Story 130256: Submit Per Diem Travel Expense

## Feature: Per Diem Travel Expense Submission

**Story:** As an employee, I want to submit a per diem request for my business trip, so that I can be reimbursed based on the daily allowance policy without submitting individual receipts.

---

## Test Case 1: Per Diem Category Selection

### Feature: Per Diem Category Access
```gherkin
Feature: Per Diem Category Selection
  As an employee
  I want to select "Per Diem" as an expense category
  So that I can submit travel expense requests without individual receipts

  Background:
    Given I am logged into the expense management system
    And I have navigated to the "Submit Expense" page

  Scenario: Successfully select Per Diem category
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

---

## Test Case 2: Travel Date and Time Input

### Feature: Travel Date and Destination Input
```gherkin
Feature: Travel Date and Time Input
  As an employee
  I want to input my travel start and end dates with times and destinations
  So that the system can calculate my travel duration for per diem purposes

  Background:
    Given I am logged into the expense management system
    And I have selected "Per Diem" as the expense category
    And I am on the per diem expense form

  Scenario: Input valid travel dates and times
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

  Scenario: Input international destinations
    When I enter "Bucharest, Romania" as outbound destination
    And I enter "New York, USA" as inbound destination
    Then the system should accept international destinations
    And store the destination information correctly

  Scenario: Validate time format input
    When I enter "25:00" as the start time
    Then the system should display a validation error
    And the error should indicate "Invalid time format. Please use HH:MM (24-hour format)"
```

---

## Test Case 3: Automatic Travel Time Calculation

### Feature: Travel Duration Calculation
```gherkin
Feature: Automatic Travel Time Calculation
  As an employee
  I want the system to automatically calculate my travel duration
  So that I don't have to manually compute the time for per diem calculations

  Background:
    Given I am logged into the expense management system
    And I have selected "Per Diem" as the expense category
    And I am on the per diem expense form

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

  Scenario: Handle overnight travel calculation
    When I enter "01/12/2025" as the start date
    And I enter "23:30" as the start time
    And I enter "02/12/2025" as the end date
    And I enter "01:15" as the end time
    Then the system should calculate "0 days, 1 hour, 45 minutes"
    And handle the day boundary correctly

  Scenario: Weekend and holiday calculation
    When I enter travel dates that span weekends
    Then the system should include all calendar days in calculation
    And not exclude weekends from travel duration
```

---

## Test Case 4: Supporting Documentation Upload

### Feature: Travel Documentation Upload
```gherkin
Feature: Supporting Documentation Upload
  As an employee
  I want to upload supporting travel documents
  So that I can provide evidence for my per diem expense request

  Background:
    Given I am logged into the expense management system
    And I have selected "Per Diem" as the expense category
    And I am on the per diem expense form

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

  Scenario: Handle file size limit exceeded
    When I attempt to upload a PDF file larger than 5MB
    Then the system should reject the upload
    And display error "File size exceeds 5MB limit. Please upload a smaller file"

  Scenario: Upload maximum number of files
    When I upload 10 valid document files
    Then all files should be uploaded successfully
    When I attempt to upload an 11th file
    Then the system should prevent the upload
    And display message "Maximum 10 files allowed per request"

  Scenario: Remove uploaded document
    Given I have uploaded "travel_approval.pdf"
    When I click the "Remove" button next to the file
    Then the file should be removed from the uploaded files list
    And I should be able to upload a replacement file
```

---

## Test Case 5: Standard Approval Workflow Integration

### Feature: Per Diem Approval Workflow
```gherkin
Feature: Per Diem Approval Workflow
  As an employee
  I want my per diem request to follow the standard approval process
  So that my travel expenses are properly authorized and reimbursed

  Background:
    Given I am logged into the expense management system
    And I have completed a per diem expense form
    And I have entered all required travel details

  Scenario: Submit per diem request for approval
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

  Scenario: Line manager rejects per diem request
    Given my per diem request is "Pending Manager Approval"
    When my line manager rejects the request with reason "Travel dates not approved"
    Then the request status should change to "Rejected"
    And I should receive a rejection notification with the reason
    And I should be able to edit and resubmit the request

  Scenario: Auto-approval for domestic short trips
    Given I submit a per diem request for domestic travel
    And the travel duration is less than 3 days
    And the estimated per diem amount is under the auto-approval threshold
    When I submit the request
    Then it should be automatically approved
    And skip manual approval steps
```

---

## Test Case 6: Form Validation and Error Handling

### Feature: Per Diem Form Validation
```gherkin
Feature: Form Validation and Error Handling
  As an employee
  I want clear validation messages for my per diem form input
  So that I can correct any errors and submit a valid request

  Background:
    Given I am logged into the expense management system
    And I have selected "Per Diem" as the expense category

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

  Scenario: Validate destination field completion
    When I enter only the outbound destination
    And leave the inbound destination empty
    And attempt to calculate travel time
    Then the system should prompt for the missing destination
    And display "Both outbound and inbound destinations are required"

  Scenario: Handle system errors gracefully
    Given the travel time calculation service is temporarily unavailable
    When I enter valid travel dates and click "Calculate"
    Then the system should display a user-friendly error message
    And provide option to try again or proceed without automatic calculation

  Scenario: Prevent duplicate submission
    Given I have successfully submitted a per diem request
    When I attempt to submit the same form again
    Then the system should prevent duplicate submission
    And display message "This request has already been submitted"
```

---

## Test Case 7: Cross-Platform and Browser Compatibility

### Feature: Per Diem System Accessibility
```gherkin
Feature: Cross-Platform Per Diem Access
  As an employee
  I want to access the per diem system from different devices and browsers
  So that I can submit expenses regardless of my current setup

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

  Scenario: Form saves progress automatically
    Given I have partially completed the per diem form
    When I navigate away from the page accidentally
    And return to the per diem form
    Then my previously entered data should be restored
    And I can continue from where I left off
```