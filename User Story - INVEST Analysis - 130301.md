# User Story Refinement Analysis

**Work Item ID:** 130301  
**Title:** Submit Local Team Building - Going Out Expense  
**Type:** User Story  
**State:** New  
**Sprint:** Sprint 72  
**Effort Points:** 5  
**Priority:** 1  
**Created By:** Andrei Avram  
**Created Date:** August 4, 2025  
**Last Updated:** October 21, 2025  

---

## 📝 **User Story**

**As a** Line Manager organizing a local team event,  
**I want to** submit a reimbursement request for going out expenses such as lunch or dinner with my team,  
**So that I can** recover the costs incurred during an approved team-building activity.

---

## ✅ **Current Acceptance Criteria**

### **AC1: Expense Category Selection**
- The user can select "Local Team Building → Going Out" as the expense category as part of other expenses.
  - **AC1a:** It will only be available for RO (Romania) at the moment with the option to globally enable/disable it.

### **AC2: Expense Details Entry**
- The user can enter details including event name, date, description, total amount, and location (Centre) - Free text areas.

### **AC3: Receipt Upload**
- The user must upload a receipt/invoice for the expense.

### **AC4: Participant Documentation**
- The user must provide a list of participating employees or attach a supporting document.

### **AC5: Approval Process**
- The request must follow the standard two-step approval process (Line Manager → Finance).

### **~~AC6: Amount Validation~~ (REMOVED)**
- ~~The system checks that the amount does not exceed the per-event or per-person limit (if applicable). - **TBD**~~

### **~~AC7: Record Keeping~~ (REMOVED)**
- ~~Approved expenses are recorded and visible in request history and financial reports.~~

### **AC8: Notifications**
- Notifications are sent to the user and approvers at each step of the approval flow.

### **AC9: Category Organization**
- Re-arrange all the categories under Other Expenses into alphabetical order A-Z.

---

## 🔍 **INVEST Analysis**

### **I - Independent ✅**
- **Score: 8/10**
- The story is largely independent but has some dependencies:
  - Depends on existing approval workflow system
  - Depends on existing expense category structure
  - Depends on notification system

### **N - Negotiable ⚠️**
- **Score: 6/10**
- **Issues:**
  - Some acceptance criteria are too detailed and implementation-specific
  - Geographic limitation (RO only) is hardcoded - should be configurable
  - UI details ("free text areas") are too specific

### **V - Valuable ✅**
- **Score: 9/10**
- Clear business value for team building expense management
- Addresses specific user need (Line Manager reimbursement)
- Part of broader expense management capability

### **E - Estimable ⚠️**
- **Score: 7/10**
- **Challenges:**
  - AC9 (alphabetical sorting) seems unrelated to main story
  - Removed AC6 and AC7 create uncertainty about requirements
  - Configuration aspects (enable/disable globally) not well defined

### **S - Small ⚠️**
- **Score: 6/10**
- **Issues:**
  - Story combines multiple concerns (new category + UI reorganization)
  - 5 story points might be too large for a single sprint
  - AC9 (alphabetical sorting) should be separate story

### **T - Testable ✅**
- **Score: 8/10**
- Most acceptance criteria are testable
- Clear success criteria for most features

**Overall INVEST Score: 7.3/10**

---

## 🚨 **Critical Issues Identified**

### **1. Scope Creep**
- **Issue:** AC9 (alphabetical sorting) is unrelated to the main user story
- **Impact:** Increases complexity and testing scope
- **Recommendation:** Split into separate story

### **2. Removed Acceptance Criteria**
- **Issue:** AC6 and AC7 are crossed out but marked "TBD"
- **Impact:** Unclear if these features are needed
- **Recommendation:** Either remove completely or clarify requirements

### **3. Geographic Limitation Hardcoding**
- **Issue:** "RO only" is hardcoded in AC1a
- **Impact:** Reduces flexibility for future expansion
- **Recommendation:** Make region configuration more flexible

### **4. Mixed Abstraction Levels**
- **Issue:** Some ACs are high-level, others are implementation details
- **Impact:** Confuses development and testing approach
- **Recommendation:** Standardize abstraction level

---

## 💡 **Refinement Recommendations**

### **1. Split the Story**
**Recommended Split:**
- **Story A:** "Submit Local Team Building - Going Out Expense" (AC1-AC5, AC8)
- **Story B:** "Reorganize Other Expenses Categories Alphabetically" (AC9)

### **2. Improve User Story Format**
```
CURRENT: "As a Line Manager organizing a local team event..."
IMPROVED: "As a Line Manager who organized a team event,
          I want to submit a going-out expense reimbursement request
          So that I can be reimbursed for approved team building activities."
```

### **3. Refined Acceptance Criteria**

#### **AC1: Category Selection** ✅ **KEEP & REFINE**
```
CURRENT: The user can select "Local Team Building → Going Out" as the expense category...
REFINED: GIVEN I am submitting an expense request
         WHEN I select expense category
         THEN I can choose "Local Team Building → Going Out" from the Other Expenses section
         AND this option is only visible to users in enabled regions (initially Romania)
```

#### **AC2: Expense Details** ✅ **KEEP & REFINE**
```
CURRENT: The user can enter details including event name, date, description...
REFINED: GIVEN I have selected the Going Out category
         WHEN I fill in expense details
         THEN I can enter:
         - Event name (required)
         - Event date (required)
         - Description (required)
         - Total amount (required, positive number)
         - Location/Centre (required)
```

#### **AC3: Receipt Upload** ✅ **KEEP**
```
REFINED: GIVEN I am submitting a going-out expense
         WHEN I upload supporting documents
         THEN I must attach at least one receipt or invoice
         AND the system validates file format and size
```

#### **AC4: Participant List** ⚠️ **NEEDS CLARIFICATION**
```
CURRENT: The user must provide a list of participating employees...
REFINED: GIVEN I am submitting a going-out expense
         WHEN I provide participant information
         THEN I can either:
         - Enter participant names manually, OR
         - Upload a supporting document with participant list
         AND the system validates at least one participant is provided
```

#### **AC5: Approval Process** ✅ **KEEP**
```
REFINED: GIVEN I submit a going-out expense request
         WHEN the approval process starts
         THEN it follows the standard two-step approval:
         1. Line Manager approval
         2. Finance approval
```

#### **AC8: Notifications** ✅ **KEEP**
```
REFINED: GIVEN an expense request changes status
         WHEN the state transition occurs
         THEN notifications are sent to:
         - Requester (on all status changes)
         - Next approver (when pending their approval)
         - Previous approver (when approved/rejected)
```

### **4. Additional Recommendations**

#### **Define "Done" Criteria**
```
✅ Category is visible in dropdown for RO users
✅ All required fields are validated
✅ Receipt upload works with common file formats (PDF, JPG, PNG)
✅ Approval workflow completes successfully
✅ Notifications are sent and received
✅ Request appears in user's expense history
✅ Feature works on mobile and desktop
✅ Accessibility requirements met
```

#### **Add Missing Acceptance Criteria**
```
AC10: Error Handling
GIVEN I submit an incomplete expense request
WHEN validation fails
THEN I see clear error messages indicating what needs to be fixed

AC11: Data Persistence
GIVEN I start filling an expense request
WHEN I navigate away and return
THEN my draft data is preserved

AC12: Security
GIVEN I am not a Line Manager
WHEN I try to access going-out expense category
THEN the option is not available to me
```

---

## 📊 **Complexity Analysis**

### **Technical Complexity: Medium-High**
- **Frontend:** Form changes, category management, file upload
- **Backend:** New expense type, approval workflow integration
- **Database:** Schema changes for new category
- **Integration:** Notification system, approval engine

### **Business Complexity: Medium**
- **Clear business rules:** Most requirements are well-defined
- **Edge cases:** Need to handle various participant list formats
- **Validation:** Amount, file format, participant validation needed

### **Testing Complexity: High**
- **Multiple user roles:** Line Manager, Finance, Admin
- **Workflow testing:** End-to-end approval process
- **File upload testing:** Various formats and sizes
- **Geographic restrictions:** RO vs non-RO users

---

## 🎯 **Recommended Story Points Re-estimation**

### **Original Story (Combined): 5 points**
### **Recommended Split:**
- **Story A (Going Out Expense):** 3 points
- **Story B (Alphabetical Sorting):** 2 points

### **Justification:**
- Reduced scope makes estimation more accurate
- Each story can be completed independently
- Clearer testing and acceptance criteria

---

## 📋 **Action Items for Product Owner**

1. **Immediate Actions:**
   - [ ] Decide on AC6 and AC7: Remove or clarify requirements
   - [ ] Split AC9 into separate story
   - [ ] Clarify participant list requirements (manual entry vs document upload)

2. **Before Sprint Planning:**
   - [ ] Define regional configuration approach (not just RO hardcoding)
   - [ ] Specify file format requirements for receipts
   - [ ] Review and approve refined acceptance criteria

3. **For Future Sprints:**
   - [ ] Plan Story B (alphabetical sorting) for separate sprint
   - [ ] Consider global rollout plan beyond Romania
   - [ ] Define reporting requirements (related to removed AC7)

---

## 🏆 **Quality Score**

| Criteria | Current Score | Target Score | Gap |
|----------|---------------|--------------|-----|
| INVEST | 7.3/10 | 9/10 | 1.7 |
| Clarity | 6/10 | 9/10 | 3.0 |
| Testability | 8/10 | 9/10 | 1.0 |
| Completeness | 7/10 | 9/10 | 2.0 |

**Overall Quality: 7.1/10 → Target: 9.0/10**

---

## 🚀 **Next Steps**

1. **Review this analysis** with Product Owner and Scrum Master
2. **Refine acceptance criteria** based on recommendations
3. **Split the story** as recommended
4. **Re-estimate story points** for each split story
5. **Update Azure DevOps** with refined requirements
6. **Plan sprint** with cleaner, smaller stories

---

*Analysis completed on: November 7, 2025*  
*Analyst: AI Testing Assistant*  
*Methodology: INVEST Framework + Agile Best Practices*