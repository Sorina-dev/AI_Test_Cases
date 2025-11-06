# 🏦 Online Banking Platform - Exploratory Testing User Personas & Scenarios

## 📋 Overview

**Testing Purpose:** Exploratory testing of online banking platform functionality  
**User Coverage:** 3 distinct persona types with realistic financial situations  
**Scenario Depth:** 5 comprehensive scenarios per persona with specific test data  
**Focus Areas:** Account management, transactions, budgeting, security, user experience

---

## 👴 Persona 1: The Retiree - "Harold Thompson"

### 👤 Complete User Profile

**Personal Information:**
- **Name:** Harold Thompson
- **Age:** 68 years old
- **Location:** Suburban Phoenix, Arizona
- **Occupation:** Retired high school teacher (35 years)
- **Tech Comfort:** Low-to-moderate (learned banking online during COVID)
- **Device Usage:** Primarily desktop computer, occasionally tablet

**Financial Profile:**
- **Primary Income:** Social Security ($2,400/month) + Teacher's Pension ($1,800/month)
- **Savings:** $185,000 in various accounts
- **Investment Portfolio:** $320,000 (mostly conservative bonds and CDs)
- **Monthly Expenses:** $3,200 (fixed), $800 (variable)
- **Banking Style:** Conservative, prefers stability over growth

**Account Structure:**
```
Primary Checking: $4,200 (monthly income deposit)
High-Yield Savings: $45,000 (emergency fund)
CD Account #1: $75,000 (18-month term, 4.2% APY)
CD Account #2: $65,000 (12-month term, 3.8% APY)
Money Market: $38,000 (higher interest savings)
Investment Account: $320,000 (managed portfolio)
```

### 🎯 Harold's Testing Scenarios

#### **Scenario 1: Monthly Pension & Social Security Management**
**Context:** Harold receives two monthly deposits and needs to allocate funds across accounts.

**Test Data:**
- **Social Security Deposit:** $2,400 (3rd Wednesday of month)
- **Pension Deposit:** $1,800 (Last business day of month)
- **Fixed Bills:** Mortgage ($890), Insurance ($340), Utilities ($280), Medicare ($165)
- **Target Action:** Move $2,000 to savings, keep $2,200 for monthly expenses

**Exploration Focus:**
- Recurring transfer setup functionality
- Account balance monitoring and alerts
- Transaction categorization for retirement income
- Bill pay scheduling and confirmation

---

#### **Scenario 2: CD Maturity and Reinvestment Decision**
**Context:** Harold's 12-month CD ($65,000) is maturing next month and he needs to explore reinvestment options.

**Test Data:**
- **Maturing CD:** Account #7834-5621, Principal: $65,000, Interest Earned: $2,470
- **Current CD Rates:** 6-month (3.5%), 12-month (4.1%), 18-month (4.3%), 24-month (4.0%)
- **Decision Factors:** May need $20,000 for home repairs within 18 months

**Exploration Focus:**
- CD rate comparison tools
- Maturation notifications and options
- Partial withdrawal scenarios
- Automatic renewal vs. manual reinvestment
- Interest calculation tools

---

#### **Scenario 3: Setting Up Beneficiary Information**
**Context:** Harold wants to update beneficiaries across all accounts after his recent remarriage.

**Test Data:**
- **New Spouse:** Margaret Thompson (DOB: 1958-03-15, SSN: 456-78-9012)
- **Adult Children:** David Thompson (40%), Sarah Johnson (40%)
- **Grandchildren Trust:** 20% split among 4 grandchildren
- **Previous Beneficiary:** Deceased spouse (needs removal)

**Exploration Focus:**
- Beneficiary management interface
- Multi-account beneficiary updates
- Legal documentation requirements
- Percentage allocation validation
- Confirmation and audit trail features

---

#### **Scenario 4: Large Medical Expense and Emergency Withdrawal**
**Context:** Harold faces unexpected medical bills and needs to access emergency funds quickly.

**Test Data:**
- **Medical Bills:** Hospital ($8,400), Specialist ($2,100), Pharmacy ($650)
- **Insurance Coverage:** Medicare covers $6,200, leaving $4,950 out-of-pocket
- **Available Funds:** Money Market ($38,000), High-Yield Savings ($45,000)
- **Time Sensitivity:** Payment due within 30 days for discount

**Exploration Focus:**
- Emergency fund access procedures
- Large transaction approval workflows
- Wire transfer vs. ACH timing and fees
- Account minimum balance warnings
- Payment scheduling and tracking

---

#### **Scenario 5: Monitoring Suspicious Activity and Fraud Alerts**
**Context:** Harold notices unfamiliar transactions and wants to understand security features.

**Test Data:**
- **Suspicious Transactions:** 
  - Online purchase: $89.99 (Amazon - not Harold's)
  - ATM withdrawal: $200 (California - Harold in Arizona)
  - Recurring charge: $12.99/month (Netflix - Harold doesn't use)
- **Legitimate Recent Activity:**
  - Pharmacy: $24.50, Gas Station: $45.00, Grocery: $127.33

**Exploration Focus:**
- Fraud detection and alert systems
- Transaction dispute process
- Account security settings and preferences
- Card locking/unlocking functionality
- Contact methods for security issues

---

## 💼 Persona 2: The Freelancer - "Jessica Martinez"

### 👤 Complete User Profile

**Personal Information:**
- **Name:** Jessica Martinez
- **Age:** 32 years old
- **Location:** Austin, Texas
- **Occupation:** Freelance Graphic Designer & Social Media Consultant
- **Tech Comfort:** High (digital native, uses multiple apps)
- **Device Usage:** MacBook Pro, iPhone 14, occasional iPad

**Financial Profile:**
- **Income:** Variable ($3,200-$8,500/month, averaging $5,400)
- **Client Mix:** 3 regular clients + 2-4 project-based clients monthly
- **Seasonal Patterns:** Higher income Q4 (holiday marketing), lower in January-February
- **Tax Obligations:** Quarterly estimated payments ($3,200-$4,800)
- **Banking Style:** Tech-savvy, needs flexibility and cash flow management

**Account Structure:**
```
Business Checking: $12,400 (client payments, business expenses)
Personal Checking: $3,200 (personal expenses, transfers from business)
High-Yield Savings: $28,000 (emergency fund + tax reserves)
Tax Savings: $8,400 (quarterly tax payments)
Investment Account: $15,600 (Roth IRA + individual investments)
Business Credit Line: $25,000 limit, $3,200 used
```

### 🎯 Jessica's Testing Scenarios

#### **Scenario 1: Managing Irregular Client Payments**
**Context:** Jessica receives payments from multiple clients at different intervals and needs to track cash flow.

**Test Data:**
- **Expected Payments:**
  - TechCorp: $4,200 (monthly retainer, due 5th)
  - LocalBiz: $1,800 (project completion, overdue 12 days)
  - StartupXYZ: $2,400 (milestone payment, due in 6 days)
  - NewClient: $950 (deposit for new project)
- **Pending Expenses:** Software subscriptions ($340), Equipment loan ($280), Quarterly taxes ($3,600)

**Exploration Focus:**
- Cash flow forecasting tools
- Payment tracking and reminders
- Account alerts for incoming deposits
- Business vs. personal expense categorization
- Invoice integration capabilities

---

#### **Scenario 2: Quarterly Tax Payment Preparation**
**Context:** Jessica needs to calculate and set aside funds for her Q1 estimated tax payment.

**Test Data:**
- **Q4 Income:** $22,800 (October: $6,200, November: $8,100, December: $8,500)
- **Business Expenses:** $4,650 (software, equipment, office supplies, marketing)
- **Estimated Tax Rate:** 28% (federal + state + self-employment)
- **Required Payment:** $4,760 (due January 15th)
- **Current Tax Savings:** $8,400

**Exploration Focus:**
- Business income/expense tracking
- Tax calculation tools and estimates
- Automated savings for tax obligations
- Payment scheduling to IRS/state
- Year-end financial reporting features

---

#### **Scenario 3: Equipment Purchase Using Credit Line**
**Context:** Jessica needs to purchase a new computer and camera equipment for expanding services.

**Test Data:**
- **Equipment List:**
  - MacBook Pro: $2,899
  - Sony Camera Kit: $1,450
  - Design Software License: $600 (annual)
  - Lighting Equipment: $380
- **Total Cost:** $5,329
- **Available Credit:** $21,800 ($25,000 limit - $3,200 used)
- **Repayment Plan:** 6 months (expecting income boost from new equipment)

**Exploration Focus:**
- Credit line access and approval
- Purchase categorization for tax purposes
- Repayment calculator and scheduling
- Interest rate information and calculations
- Business credit reporting features

---

#### **Scenario 4: Setting Up Multiple Income Streams**
**Context:** Jessica is diversifying income with a new passive revenue stream and needs to organize multiple payment sources.

**Test Data:**
- **New Income Sources:**
  - Online Course Sales: $640/month (growing)
  - Stock Photo Licensing: $180/month
  - Affiliate Marketing: $95/month
  - YouTube Ad Revenue: $45/month
- **Existing Clients:** TechCorp ($4,200), LocalBiz ($1,800), various projects ($2,000-$4,000)

**Exploration Focus:**
- Multiple income source tracking
- Automated categorization by source
- Revenue trend analysis tools
- Integration with payment platforms (PayPal, Stripe)
- Income diversification reporting

---

#### **Scenario 5: Emergency Fund Access During Slow Period**
**Context:** January-February slowdown requires accessing emergency funds to maintain personal expenses.

**Test Data:**
- **Monthly Personal Expenses:** $2,800 (rent, food, utilities, insurance, minimums)
- **Projected Income:** January: $1,200, February: $1,800
- **Shortfall:** $2,600 over two months
- **Emergency Fund:** $28,000 available
- **Recovery Plan:** Major project starting in March ($6,400)

**Exploration Focus:**
- Emergency fund access procedures
- Temporary budget adjustment tools
- Cash flow recovery planning
- Low balance alerts and management
- Seasonal business planning features

---

## 🎓 Persona 3: The Young Adult - "Alex Chen"

### 👤 Complete User Profile

**Personal Information:**
- **Name:** Alex Chen
- **Age:** 22 years old
- **Location:** Seattle, Washington
- **Occupation:** Junior Software Developer (6 months experience)
- **Tech Comfort:** Very High (Gen Z digital native)
- **Device Usage:** iPhone 15, gaming laptop, Apple Watch

**Financial Profile:**
- **Income:** $4,800/month gross ($3,600 net after taxes/benefits)
- **Student Loans:** $42,000 ($380/month minimum payment)
- **First Real Job:** Started 6 months ago, learning financial management
- **Goals:** Build emergency fund, pay down loans, start investing
- **Banking Style:** Mobile-first, wants automation and education

**Account Structure:**
```
Checking Account: $2,100 (direct deposit, daily expenses)
High-Yield Savings: $6,400 (emergency fund building)
Student Loan Account: $42,000 balance ($380/month payment)
Credit Card: $2,500 limit, $480 balance (building credit)
Investment Account: $1,200 (just started, mostly ETFs)
```

### 🎯 Alex's Testing Scenarios

#### **Scenario 1: First-Time Budget Setup and Automation**
**Context:** Alex wants to create a sustainable budget and automate savings to build good financial habits.

**Test Data:**
- **Monthly Net Income:** $3,600
- **Fixed Expenses:** Rent ($1,200), Student loan ($380), Phone ($85), Insurance ($160)
- **Variable Expenses:** Food ($400), Transportation ($200), Entertainment ($300)
- **Savings Goals:** Emergency fund ($500/month), Investments ($200/month)
- **Buffer:** $175 for unexpected expenses

**Exploration Focus:**
- Budget creation tools and templates
- Automatic savings transfers
- Spending categorization and tracking
- Goal-setting and progress monitoring
- Mobile app budgeting features

---

#### **Scenario 2: Building Credit History and Monitoring**
**Context:** Alex wants to understand and improve their credit score while managing their first credit card responsibly.

**Test Data:**
- **Current Credit Score:** 680 (limited history, 6 months)
- **Credit Card Balance:** $480 on $2,500 limit (19.2% utilization)
- **Recent Activity:** 
  - Coffee shop: $15.50 (daily)
  - Streaming services: $45/month
  - Gas: $60/month
  - Online shopping: $120 (recent)

**Exploration Focus:**
- Credit score monitoring and education
- Credit utilization tracking and alerts
- Payment reminders and autopay setup
- Credit building tips and recommendations
- Integration with credit monitoring services

---

#### **Scenario 3: Student Loan Management and Optimization**
**Context:** Alex wants to understand repayment options and potentially pay extra toward loans when possible.

**Test Data:**
- **Loan Details:**
  - Federal Loan #1: $28,000 @ 4.5% (10-year term)
  - Federal Loan #2: $14,000 @ 5.2% (10-year term)
- **Current Payment:** $380/month total
- **Available for Extra Payments:** $100-200/month occasionally
- **Payoff Goal:** Reduce to 7-8 years if possible

**Exploration Focus:**
- Loan balance and payment tracking
- Extra payment allocation strategies
- Payoff calculators and scenarios
- Interest savings projections
- Integration with loan servicer data

---

#### **Scenario 4: Starting Investment Journey**
**Context:** Alex wants to begin investing but needs education and simple tools to get started safely.

**Test Data:**
- **Available for Investing:** $200/month consistently
- **Risk Tolerance:** Moderate (long-term growth, some volatility okay)
- **Investment Knowledge:** Beginner (knows basics, wants to learn)
- **Goals:** Retirement (40+ years), House down payment (5-7 years)
- **Current Investment:** $1,200 in target-date fund

**Exploration Focus:**
- Investment education resources
- Simple portfolio recommendations
- Automatic investment setup
- Goal-based investing tools
- Performance tracking and education

---

#### **Scenario 5: Managing Social Expenses and Peer Payments**
**Context:** Alex frequently splits bills with friends and needs efficient ways to manage group expenses and payments.

**Test Data:**
- **Recent Group Expenses:**
  - Dinner with friends: $85 (Alex paid, expecting $17 from 4 people)
  - Concert tickets: $240 (friend paid, Alex owes $60)
  - Weekend trip: $180 (Alex's share of Airbnb)
  - Group gift: $45 (Alex organizing, collecting from 8 people)

**Exploration Focus:**
- Peer-to-peer payment integration
- Expense splitting and tracking tools
- Request money functionality
- Group expense management
- Integration with popular payment apps (Venmo, Zelle)

---

## 📊 Cross-Persona Testing Matrix

### **Common Banking Features to Test Across All Personas**

| Feature | Harold's Perspective | Jessica's Perspective | Alex's Perspective |
|---------|---------------------|----------------------|-------------------|
| **Mobile App** | Learns slowly, prefers large text | Primary interface, needs efficiency | Native usage, expects modern UX |
| **Security** | High concern, prefers extra verification | Balance of security and convenience | Expects seamless but secure |
| **Transfers** | Scheduled, recurring, large amounts | Frequent, variable amounts | Small, frequent, often to peers |
| **Alerts** | Conservative settings, email preferred | Customized for cash flow | Real-time, mobile notifications |
| **Customer Service** | Phone preferred, patient with process | Chat/email, quick resolution needed | Self-service preferred, FAQ/guides |

### **Scenario Complexity Levels**

**🔥 High Priority (Core Banking Functions):**
- Account balance checking and transfers
- Bill payment and scheduling
- Security and fraud protection
- Mobile app basic functionality

**📊 Medium Priority (Enhanced Features):**
- Investment and savings tools
- Credit monitoring and management
- Budgeting and spending analysis
- Multi-account management

**📈 Low Priority (Advanced Features):**
- Complex reporting and analytics
- Integration with external services
- Advanced security settings
- Specialized account types

---

## 🎯 Exploratory Testing Strategy

### **Session Structure (Per Persona)**
1. **Setup Phase (15 minutes):** Create test accounts with persona data
2. **Core Function Testing (30 minutes):** Basic banking operations
3. **Persona-Specific Scenarios (45 minutes):** 1-2 detailed scenarios
4. **Edge Case Exploration (15 minutes):** Error handling and limits
5. **Usability Assessment (15 minutes):** UX from persona perspective

### **Key Metrics to Observe**
- **Task Completion Time:** How long typical operations take
- **Error Rates:** Frequency of user mistakes or system errors
- **Navigation Efficiency:** Steps required for common tasks
- **Feature Discoverability:** How easily users find needed functions
- **Accessibility:** Compliance with different user needs and abilities

---

**Testing Guide Version:** 1.0  
**Created:** November 6, 2025  
**Total Scenarios:** 15 (5 per persona)  
**Coverage:** Personal banking, business banking, investment, security, mobile experience