# Refinement Questions - User Story 130256

## Story: Submit Per Diem Travel Expense

### Current Status
- **Story ID:** 130256
- **Status:** Done ✅
- **Analysis Purpose:** Retrospective learning for future per diem and travel expense stories

---

## Critical Questions for Product Owner

### 1. Travel Time Calculation (AC3)
**Current AC:** "The system automatically calculates the travel time."

**Questions:**
- Q1.1: How exactly should travel time be calculated? (Simple date difference or considering business hours?)
- Q1.2: Should the system account for weekends and holidays in travel time calculation?
- Q1.3: What should be the display format for calculated time? (Days only, hours, or days + hours?)
- Q1.4: Does calculated travel time affect the per diem amount, or is it just for display?
- Q1.5: How should partial days be handled? (Round up/down or precise calculation?)

**Business Impact:** This affects the core functionality and user experience.

### 2. Approval Workflow Definition (AC5)
**Current AC:** "The request follows the standard approval workflow."

**Questions:**
- Q2.1: What specifically is the "standard approval workflow" for per diem requests?
- Q2.2: Are there different approval paths based on:
  - Travel duration?
  - Estimated per diem amount?
  - Domestic vs international travel?
  - Employee level/department?
- Q2.3: Who are the specific approvers in the chain?
- Q2.4: Are there auto-approval rules for certain scenarios?
- Q2.5: What happens if an approver is unavailable (vacation/sick leave)?

**Business Impact:** Critical for compliance and process efficiency.

### 3. Date and Time Input Specifications (AC2)
**Current AC:** "The user will input start - end date with time (hours and minutes) along with the outbound and inbound destinations."

**Questions:**
- Q3.1: What time format should be used? (12-hour AM/PM vs 24-hour format?)
- Q3.2: How should timezone differences be handled for international travel?
- Q3.3: Should the system validate that end time is after start time?
- Q3.4: What's the minimum and maximum allowed travel duration?
- Q3.5: Should the system suggest common departure/arrival times?

**Business Impact:** Affects user experience and data accuracy.

### 4. Destination Input Requirements (AC2)
**Current AC:** "outbound and inbound destinations"

**Questions:**
- Q4.1: Should destinations be:
  - Free text fields?
  - Dropdown with predefined locations?
  - Auto-complete with city/country database?
- Q4.2: What level of detail is required? (City, Country, Address, Airport codes?)
- Q4.3: Should the system validate destination formats?
- Q4.4: Are there restrictions on travel destinations based on company policy?

**Business Impact:** Data consistency and policy compliance.

### 5. File Upload Specifications (AC4)
**Current AC:** "The user can upload supporting travel documentation (e.g., trip approval, itinerary)."

**Questions:**
- Q5.1: What file formats are acceptable? (PDF, JPG, PNG, DOC, XLS, etc.)
- Q5.2: What's the maximum file size limit per file?
- Q5.3: How many files can be uploaded per request?
- Q5.4: Is document upload mandatory or optional?
- Q5.5: Are there specific document types required? (flight bookings, hotel confirmations, etc.)
- Q5.6: Should the system scan for sensitive information in uploaded documents?

**Business Impact:** Security, storage costs, and compliance requirements.

---

## Technical Questions for Development Team

### 6. System Integration Points
**Questions:**
- Q6.1: How does this integrate with existing expense category system?
- Q6.2: What APIs or services are needed for travel time calculations?
- Q6.3: Where will uploaded documents be stored? (Azure Blob, SharePoint, etc.)
- Q6.4: How will this connect to the approval workflow system?

### 7. Performance and Scalability
**Questions:**
- Q7.1: Expected volume of per diem requests per day/month?
- Q7.2: Any performance requirements for travel time calculation?
- Q7.3: File storage capacity planning needed?

### 8. Security and Compliance
**Questions:**
- Q8.1: What data privacy regulations apply to travel data?
- Q8.2: Should travel destinations be logged for audit purposes?
- Q8.3: Any encryption requirements for uploaded documents?

---

## UX/UI Questions for Design Team

### 9. User Experience Design
**Questions:**
- Q9.1: Should the per diem form be a single page or multi-step wizard?
- Q9.2: How should date/time pickers be designed for optimal usability?
- Q9.3: Should there be a map integration for destination selection?
- Q9.4: How should calculated travel time be displayed to the user?
- Q9.5: What mobile experience is expected for this feature?

### 10. Error Handling and Validation
**Questions:**
- Q10.1: What error messages should be shown for invalid date ranges?
- Q10.2: How should file upload errors be communicated?
- Q10.3: What validation should happen in real-time vs on form submission?

---

## Business Rules Questions

### 11. Policy and Compliance
**Questions:**
- Q11.1: Are there company-specific per diem rates based on destinations?
- Q11.2: What happens if travel dates change after submission?
- Q11.3: Can users edit per diem requests after submission?
- Q11.4: Are there audit trail requirements for all changes?

### 12. Edge Cases and Exceptions
**Questions:**
- Q12.1: How should same-day travel be handled?
- Q12.2: What about travel that crosses multiple time zones?
- Q12.3: How to handle emergency/last-minute travel approvals?
- Q12.4: What if required documents are unavailable at submission time?

---

## Acceptance Criteria Refinement Suggestions

### Enhanced AC2
```
AC2: The user inputs travel details including:
- Start date and time (DD/MM/YYYY HH:MM format, 24-hour)
- End date and time (DD/MM/YYYY HH:MM format, 24-hour)
- Departure location (city, country)
- Arrival location (city, country)
- System validates end time is after start time
- System validates travel duration is between 1 hour and 365 days
```

### Enhanced AC3
```
AC3: The system automatically calculates travel duration:
- Displays total travel time in days and hours
- Calculation: (End Date/Time) - (Start Date/Time)
- Partial days are displayed as decimal (e.g., 2.5 days)
- Updates automatically when dates/times change
```

### Enhanced AC4
```
AC4: Document upload functionality:
- Accepts PDF, JPG, PNG, DOC, DOCX files
- Maximum 5MB per file, 10 files total per request
- Document upload is optional
- Files are scanned for malware
- Uploaded files are encrypted at rest
```

### Enhanced AC5
```
AC5: Approval workflow:
- Step 1: Line Manager approval (required)
- Step 2: Finance team approval (required for amounts >$X)
- Auto-approval for domestic travel <3 days (configurable)
- Email notifications sent at each step
- 5-day timeout with escalation rules
```

---

## Priority Ranking for Refinement

### Must Have (Blocking Development)
1. ⚡ Travel time calculation algorithm definition
2. ⚡ Approval workflow specification
3. ⚡ Date/time input format and validation rules

### Should Have (Risk Mitigation)
4. 🔸 File upload technical specifications
5. 🔸 Destination input format requirements
6. 🔸 Error handling and validation rules

### Could Have (Enhancement)
7. ◦ UI/UX design mockups
8. ◦ Mobile experience requirements
9. ◦ Advanced features (map integration, etc.)

---

**Document Created:** November 7, 2025  
**For Sprint:** Retrospective Analysis  
**Status:** Ready for Product Owner Review