# ✈️ Flight Booking Form - Test Data Matrix

## 📋 Test Scope

**Application:** Flight Booking Form  
**Test Fields:**
- Departure City (Required)
- Destination City (Required) 
- Departure Date (Required)
- Return Date (Optional for one-way)
- Number of Passengers (Required, 1-10)
- Class (Required: Economy, Business, First)

**Test Coverage:** 15 comprehensive test cases including positive scenarios, validation errors, boundary cases, and special situations.

---

## 🧪 Test Data Matrix

| Test Case ID | Test Type | Departure City | Destination City | Departure Date | Return Date | Passengers | Class | Expected Behavior | Priority |
|--------------|-----------|----------------|------------------|----------------|-------------|------------|-------|-------------------|----------|
| **TC01** | **✅ Positive - Valid Booking** | London | New York | 2025-12-15 | 2025-12-22 | 2 | Economy | Booking successful, confirmation displayed with flight details | **🔥 High** |
| **TC02** | **✅ Positive - Business Class** | Paris | Tokyo | 2025-11-20 | 2025-11-25 | 1 | Business | Booking successful with premium options and lounge access | **🔥 High** |
| **TC03** | **✅ Positive - Large Group** | Berlin | Madrid | 2026-01-10 | 2026-01-15 | 9 | Economy | Booking successful, group pricing applied, seat selection available | **📊 Medium** |
| **TC04** | **⚠️ Boundary - Max Passengers** | Rome | Athens | 2025-12-01 | 2025-12-05 | 10 | First | Booking successful at maximum capacity limit | **🔥 High** |
| **TC05** | **❌ Validation - Same Cities** | London | London | 2025-11-30 | 2025-12-07 | 1 | Economy | Error: "Departure and destination cities cannot be the same" | **🔥 High** |
| **TC06** | **❌ Validation - Past Departure** | Dubai | Mumbai | 2025-10-01 | 2025-10-08 | 2 | Business | Error: "Departure date cannot be in the past" | **🔥 High** |
| **TC07** | **❌ Validation - Return Before Departure** | Sydney | Melbourne | 2025-12-20 | 2025-12-18 | 1 | Economy | Error: "Return date must be after departure date" | **🔥 High** |
| **TC08** | **⚠️ Boundary - Zero Passengers** | Miami | Los Angeles | 2025-12-10 | 2025-12-17 | 0 | Economy | Error: "Number of passengers must be at least 1" | **📊 Medium** |
| **TC09** | **⚠️ Boundary - Excessive Passengers** | Barcelona | Lisbon | 2025-11-25 | 2025-11-30 | 15 | Business | Error: "Maximum 10 passengers allowed per booking" | **📊 Medium** |
| **TC10** | **🎯 Special - One Way Trip** | Chicago | Denver | 2025-12-05 | *blank* | 1 | First | One-way booking successful, no return flight displayed | **📊 Medium** |
| **TC11** | **🎯 Special - Same Day Return** | Amsterdam | Brussels | 2025-11-15 | 2025-11-15 | 2 | Economy | Day trip booking successful with time constraints | **📈 Low** |
| **TC12** | **❌ Validation - Invalid Date Format** | Vienna | Prague | 15/12/2025 | 22/12/2025 | 1 | Economy | Error: "Please enter date in YYYY-MM-DD format" | **📊 Medium** |
| **TC13** | **⚠️ Boundary - Far Future Date** | Cairo | Istanbul | 2027-06-01 | 2027-06-08 | 3 | Business | Error: "Bookings only available up to 12 months in advance" | **📈 Low** |
| **TC14** | **🎯 Special - Weekend Premium** | Las Vegas | San Francisco | 2025-12-13 | 2025-12-15 | 4 | First | Weekend surcharge applied, booking successful with premium pricing | **📊 Medium** |
| **TC15** | **❌ Validation - Empty Required Fields** | *blank* | *blank* | *blank* | 2025-12-20 | 1 | Economy | Error: "Please fill in all required fields" | **🔥 High** |

---

## 📊 Test Case Distribution Analysis

### By Test Type
```
✅ Positive Scenarios:    5 cases (33%) - Core happy path functionality
❌ Validation Errors:     6 cases (40%) - Input validation and business rules  
⚠️ Boundary Cases:        3 cases (20%) - Edge conditions and limits
🎯 Special Situations:    1 case (7%)  - Unique business scenarios
```

### By Priority Level
```
🔥 High Priority:    7 cases (47%) - Critical functionality & core validations
📊 Medium Priority:  6 cases (40%) - Important edge cases & boundaries  
📈 Low Priority:     2 cases (13%) - Nice-to-have scenarios & extended features
```

---

## 🎯 Test Execution Strategy

### **Phase 1: High Priority (🔥)**
Execute TC01, TC02, TC04, TC05, TC06, TC07, TC15
- **Focus:** Core booking functionality and critical validations
- **Expected Duration:** 2-3 hours
- **Blocker Impact:** High - affects primary user journeys

### **Phase 2: Medium Priority (📊)**  
Execute TC03, TC08, TC09, TC12, TC14
- **Focus:** Edge cases and important boundary conditions
- **Expected Duration:** 1-2 hours
- **Blocker Impact:** Medium - affects user experience

### **Phase 3: Low Priority (📈)**
Execute TC11, TC13  
- **Focus:** Extended scenarios and future enhancements
- **Expected Duration:** 30 minutes
- **Blocker Impact:** Low - affects edge user scenarios

---

## 📋 Supporting Test Data

### **Valid City Examples**
```json
{
  "major_international": [
    "London", "New York", "Paris", "Tokyo", "Dubai", "Sydney",
    "Frankfurt", "Singapore", "Los Angeles", "Hong Kong"
  ],
  "european_cities": [
    "Berlin", "Madrid", "Rome", "Athens", "Vienna", "Prague",
    "Amsterdam", "Brussels", "Barcelona", "Lisbon"
  ],
  "us_domestic": [
    "Chicago", "Denver", "Miami", "Las Vegas", "San Francisco",
    "Boston", "Seattle", "Atlanta", "Dallas", "Phoenix"
  ]
}
```

### **Date Test Scenarios**
```json
{
  "valid_dates": {
    "near_future": "2025-11-15 to 2025-12-31",
    "peak_season": "2025-12-20 to 2026-01-05", 
    "off_season": "2026-02-01 to 2026-03-31",
    "weekend_dates": "2025-12-13, 2025-12-14, 2025-12-15"
  },
  "invalid_dates": {
    "past_dates": "2025-10-01, 2025-09-15",
    "invalid_formats": ["15/12/2025", "Dec 15 2025", "2025.12.15"],
    "non_existent": ["2025-02-30", "2025-13-01", "2025-04-31"]
  }
}
```

### **Passenger & Class Combinations**
```json
{
  "economy": {
    "max_passengers": 10,
    "base_price": 500,
    "features": ["Standard seat", "Meal included", "Checked bag fee"]
  },
  "business": {
    "max_passengers": 8,
    "price_multiplier": 2.5,
    "features": ["Priority boarding", "Lounge access", "Premium meals"]
  },
  "first": {
    "max_passengers": 6, 
    "price_multiplier": 4.0,
    "features": ["Flat bed seats", "Concierge service", "Premium amenities"]
  }
}
```

---

## 🚀 Automation Recommendations

### **High Automation Priority**
- **TC01, TC02:** Core positive flows - ideal for smoke tests
- **TC05, TC06, TC07:** Validation errors - perfect for regression
- **TC08, TC09:** Boundary testing - excellent for data-driven tests

### **API Test Candidates**
- Date validation logic (TC06, TC07, TC12, TC13)
- Passenger count validation (TC08, TC09)
- City validation (TC05)

### **UI Test Candidates**  
- Complete booking flow (TC01, TC02, TC10)
- Form validation messages (TC05, TC15)
- Class selection and pricing (TC14)

---

## 📈 Expected Results Summary

| Category | Pass Criteria | Fail Criteria |
|----------|---------------|----------------|
| **Successful Bookings** | Confirmation page displayed with booking reference | Error message or system failure |
| **Validation Errors** | Clear, specific error message displayed | Generic error or system crash |
| **Boundary Cases** | Appropriate handling at limits | System allows invalid data |
| **Special Cases** | Business logic correctly applied | Incorrect pricing or logic errors |

---

**Test Matrix Created:** November 6, 2025  
**Version:** 1.0  
**Coverage:** Comprehensive flight booking form validation  
**Total Test Cases:** 15  
**Estimated Execution Time:** 3.5-5.5 hours