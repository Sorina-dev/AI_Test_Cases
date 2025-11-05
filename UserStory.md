## User Story: Submit Transport Expense

**As an employee**,  
I want to submit a transport expense for travel-related costs such as taxi or train fares,  
So that I can be reimbursed for necessary business transportation.

---

### 🎯 Acceptance Criteria

**AC1:**  
The user can select **"Transportation"** as an *Other Expense* category.

**AC2:**  
The user can specify the **transport type**, such as:
- Taxi  
- Train  
- Bus

**AC3:**  
The user can enter the following details for each transport cost:
- **Amount**  
- **Date**  
- **Short description**

**AC4:**  
The user **must upload a receipt or proof of payment** for each transport expense.

**AC5:**  
The request supports **submission of multiple transport expenses** under one transportation reimbursement request.

**AC6:**  
Transport expenses follow the **standard approval process**, including:
- Manager review  
- Finance validation  
- Final approval

---

### 📝 Notes
- Validation rules should ensure all required fields are completed.
- Uploaded receipts must be in accepted formats (e.g., PDF, JPG, PNG).
- Transport types should be configurable for future additions.