# Medical Expense Inactive Users Report

**Generated on:** 11/7/2025  
**Database:** sqldb-expensemanagement-stage  
**Query Purpose:** Find users who placed medical expenses in 2025 but haven't made any in the last 3 months

---

## 📊 Query Results Summary

- **Total Users Found:** 16
- **Criteria:** Users with medical expenses in 2025 but inactive for 3+ months
- **Date Range:** January 1, 2025 to 11/7/2025

---

## 👤 Inactive Users Details

| # | Employee Name | Email | Department | Last Medical Expense Date | Days Since Last | Total 2025 Expenses | Last Amount |
|---|---------------|-------|------------|---------------------------|-----------------|---------------------|-------------|
| 1 | **Victor Manolache** | victor.manolache@amdaris.com | Software Development | 8/7/2025 | 92 days | 4 | $53975 |
| 2 | **Ion Chiriac** | ion.chiriac@amdaris.com | Software Development | 8/4/2025 | 95 days | 6 | $9795 |
| 3 | **Gabriel Bordianu** | gabriel.bordianu@amdaris.com | IT | 7/30/2025 | 100 days | 1 | $1000 |
| 4 | **Eduard Popescu** | eduard.popescu@amdaris.com | Software Development | 7/25/2025 | 105 days | 1 | $333 |
| 5 | **Bianca Pereteanu** | bianca.pereteanu@amdaris.com1 | N/A | 7/21/2025 | 109 days | 1 | $123 |
| 6 | **Andrei Avram** | andrei.avram@amdaris.com1 | N/A | 7/21/2025 | 109 days | 4 | $11233 |
| 7 | **Zsolt Marton** | zsolt.marton@amdaris.com | N/A | 7/17/2025 | 113 days | 2 | $2000 |
| 8 | **Zsolt-Robert Marton** | zsolt.marton@amdaris.com | Software Development | 7/14/2025 | 116 days | 3 | $6021 |
| 9 | **Dmitri Panichin** | dmitri.panichin@amdaris.com | Software Development | 7/8/2025 | 122 days | 100 | $18299 |
| 10 | **Maria Racovita** | mariana.racovita@amdaris.com | Finance | 5/30/2025 | 161 days | 1 | $6500 |
| 11 | **Olga Snegur** | olga.snegur@amdaris.com | Technology Management | 5/14/2025 | 177 days | 1 | $7000 |
| 12 | **Adrian Melnic** | adrian.melnic@amdaris.com | Software Development | 5/11/2025 | 180 days | 7 | $555 |
| 13 | **Maxim Marina** | maxim.marina@amdaris.com | Software Development | 4/29/2025 | 192 days | 44 | $4300 |
| 14 | **Ludmila Salaur** | ludmila.salaur@amdaris.com | Software Development | 2/21/2025 | 259 days | 11 | $200 |
| 15 | **Nicolae Chilimari** | nicolae.chilimari@amdaris.com | Software Development | 2/7/2025 | 273 days | 1 | $123 |
| 16 | **Daniela Cazac** | daniela.cazac@amdaris.com | Software Development | 1/23/2025 | 288 days | 5 | $200 |

---

## 📈 Analysis Insights

### Key Statistics:
- **Average Days Since Last Medical Expense:** 156 days
- **Total Medical Expenses by These Users in 2025:** 192
- **Most Inactive User:** Daniela Cazac (288 days)
- **Most Recent Inactive User:** Victor Manolache (92 days)

### Department Distribution:
- **Software Development:** 10 users
- **IT:** 1 users
- **Unknown:** 3 users
- **Finance:** 1 users
- **Technology Management:** 1 users

---

## 🚨 Recommendations

### Immediate Actions:
1. **Follow-up Communication:** Reach out to inactive users about their medical expense benefits
2. **System Check:** Verify if there are any technical issues preventing submissions
3. **Budget Utilization:** Review if users have remaining medical expense budgets

### Process Improvements:
1. **Reminder System:** Implement automated reminders for medical expense submissions
2. **Usage Analytics:** Monitor medical expense utilization patterns
3. **User Training:** Provide refresher training on medical expense submission process

---

## 📝 SQL Query Used

```sql
WITH MedicalExpenseUsers AS (
    -- Find users who made medical expenses in current year (2025)
    SELECT DISTINCT
        e.Id as EmployeeId,
        e.FirstName + ' ' + e.LastName as EmployeeName,
        e.Email,
        e.Department
    FROM Employees e
    INNER JOIN MedicalExpenses me ON e.Id = me.EmployeeId
    WHERE YEAR(me.CreatedOn) = 2025
      AND me.IsDeleted = 0
),
RecentMedicalExpenses AS (
    -- Find users who made medical expenses in last 3 months
    SELECT DISTINCT
        me.EmployeeId
    FROM MedicalExpenses me
    WHERE me.CreatedOn >= DATEADD(MONTH, -3, GETDATE())
      AND me.IsDeleted = 0
),
LastMedicalExpenseDate AS (
    -- Get the last medical expense date for each user
    SELECT 
        me.EmployeeId,
        MAX(me.CreatedOn) as LastMedicalExpenseDate,
        MAX(me.Amount) as LastExpenseAmount,
        MAX(me.Description) as LastExpenseDescription
    FROM MedicalExpenses me
    WHERE me.IsDeleted = 0
    GROUP BY me.EmployeeId
)
SELECT 
    meu.EmployeeName,
    meu.Email,
    meu.Department,
    lmed.LastMedicalExpenseDate,
    lmed.LastExpenseAmount,
    lmed.LastExpenseDescription,
    DATEDIFF(DAY, lmed.LastMedicalExpenseDate, GETDATE()) as DaysSinceLastExpense,
    COUNT(me_all.Id) as TotalMedicalExpenses2025
FROM MedicalExpenseUsers meu
LEFT JOIN RecentMedicalExpenses rme ON meu.EmployeeId = rme.EmployeeId
INNER JOIN LastMedicalExpenseDate lmed ON meu.EmployeeId = lmed.EmployeeId
LEFT JOIN MedicalExpenses me_all ON meu.EmployeeId = me_all.EmployeeId 
    AND YEAR(me_all.CreatedOn) = 2025 
    AND me_all.IsDeleted = 0
WHERE rme.EmployeeId IS NULL  -- Users NOT in recent medical expenses
GROUP BY 
    meu.EmployeeName, 
    meu.Email, 
    meu.Department,
    lmed.LastMedicalExpenseDate,
    lmed.LastExpenseAmount,
    lmed.LastExpenseDescription
ORDER BY lmed.LastMedicalExpenseDate DESC
```

---

*Report generated using automated database analysis tools.*  
*Last updated: 11/7/2025*