# 🧪 User Profile Test Data Cheat Sheet

## 📋 Overview

**Purpose:** Comprehensive test data reference for user profile form validation  
**Coverage:** 10 common profile field types with valid, invalid, and tricky test cases  
**Use Case:** Manual testing, automated test data generation, edge case discovery

---

## 👤 Full Name

### ✅ Valid Examples (5)
1. **John Smith** - Standard Western name
2. **María José García-López** - Spanish name with accents and hyphen
3. **李小明** - Chinese characters
4. **Jean-François O'Connor** - French name with apostrophe and hyphen
5. **Dr. Elizabeth Montgomery III** - Title and suffix

### ❌ Invalid Examples (5)
1. **J** - Too short (single character)
2. **123 John** - Contains numbers
3. **John@Smith** - Contains special characters (@)
4. **John Smith!!!** - Multiple exclamation marks
5. **(empty)** - Required field left blank

### 🎯 Tricky Values (3)
1. **Ñoño Ñáñez** 
   - *Testing:* Unicode handling for Spanish ñ character
2. **X Æ A-XII Musk**
   - *Testing:* Mixed alphanumeric characters, unusual combination
3. **صالح الدين الأيوبي** 
   - *Testing:* Right-to-left Arabic script handling

---

## 📅 Date of Birth

### ✅ Valid Examples (5)
1. **1990-05-15** - Standard adult age (35 years old)
2. **2006-12-31** - Teenager (18 years old)
3. **1950-01-01** - Senior citizen (75 years old)
4. **2000-02-29** - Leap year date
5. **1985-07-04** - Independence Day date

### ❌ Invalid Examples (5)
1. **2030-01-01** - Future date
2. **1800-12-25** - Too old (unrealistic)
3. **2025-02-30** - Invalid date (February doesn't have 30 days)
4. **15/05/1990** - Wrong format (DD/MM/YYYY instead of YYYY-MM-DD)
5. **not-a-date** - Non-date string

### 🎯 Tricky Values (3)
1. **1900-02-29**
   - *Testing:* 1900 was not a leap year (century rule exception)
2. **2024-02-29**
   - *Testing:* Recent leap year validation
3. **2007-01-01**
   - *Testing:* Exactly 18 years old (age boundary for legal adults)

---

## ⚧️ Gender

### ✅ Valid Examples (5)
1. **Male** - Standard option
2. **Female** - Standard option
3. **Non-binary** - Inclusive option
4. **Prefer not to say** - Privacy option
5. **Other** - Open-ended option

### ❌ Invalid Examples (5)
1. **M** - Abbreviated format (if full words required)
2. **Apache Helicopter** - Joke/troll entry
3. **123** - Numeric value
4. **male** - Wrong case (if case-sensitive)
5. **(empty)** - Required field left blank

### 🎯 Tricky Values (3)
1. **Transgender woman**
   - *Testing:* Specific gender identity handling beyond basic options
2. **Agender**
   - *Testing:* Less common gender identity recognition
3. **Two-Spirit**
   - *Testing:* Indigenous gender concept, cultural sensitivity

---

## 🌍 Country

### ✅ Valid Examples (5)
1. **United States** - Full country name
2. **UK** - Common abbreviation
3. **Germany** - European country
4. **新加坡** - Singapore in Chinese
5. **Côte d'Ivoire** - Country with special characters

### ❌ Invalid Examples (5)
1. **Atlantis** - Fictional country
2. **USSR** - Obsolete country
3. **California** - State, not country
4. **123Country** - Contains numbers
5. **Earth** - Too broad/not specific

### 🎯 Tricky Values (3)
1. **Taiwan**
   - *Testing:* Politically sensitive territory recognition
2. **Palestine**
   - *Testing:* Disputed territory/political sensitivity
3. **The Former Yugoslav Republic of Macedonia**
   - *Testing:* Very long official country name handling

---

## 🏙️ City

### ✅ Valid Examples (5)
1. **New York** - Major US city
2. **São Paulo** - City with accent marks
3. **Al-Qāhirah** - Cairo in Arabic transliteration
4. **Krung Thep Mahanakhon** - Bangkok's official name
5. **Saint-Jean-sur-Richelieu** - French city with hyphens

### ❌ Invalid Examples (5)
1. **NYC123** - Contains numbers
2. **City@Name** - Contains special characters
3. **A** - Too short
4. **California** - State name used as city
5. **(empty)** - Required field blank

### 🎯 Tricky Values (3)
1. **Taumatawhakatangihangakoauauotamateaturipukakapikimaungahoronukupokaiwhenuakitanatahu**
   - *Testing:* Longest place name in the world (85 characters)
2. **Hell, Norway**
   - *Testing:* Unusual city name that might trigger content filters
3. **Truth or Consequences**
   - *Testing:* City name with unusual characters (spaces, "or")

---

## 🏠 Street Address

### ✅ Valid Examples (5)
1. **123 Main Street, Apt 4B** - Standard US address with apartment
2. **456 Oak Avenue** - Simple street address
3. **789 First St, Suite 200** - Business address with suite
4. **12-34 Cherry Lane** - Address with hyphenated number
5. **One Microsoft Way** - Written-out number

### ❌ Invalid Examples (5)
1. **Street** - Missing house number
2. **123** - Missing street name
3. **123 Main St @#$** - Invalid special characters
4. **<script>alert('xss')</script>** - XSS attack attempt
5. **(empty)** - Required field blank

### 🎯 Tricky Values (3)
1. **1/2 Baker Street**
   - *Testing:* Fractional house numbers (common in some regions)
2. **Rural Route 1, Box 123**
   - *Testing:* Rural addressing system
3. **Постоянная улица, дом 15** 
   - *Testing:* Cyrillic characters (Russian address)

---

## 📮 Postal Code

### ✅ Valid Examples (5)
1. **90210** - US ZIP code (5 digits)
2. **90210-1234** - US ZIP+4 code
3. **M5V 3L9** - Canadian postal code
4. **SW1A 1AA** - UK postcode
5. **75001** - French postal code

### ❌ Invalid Examples (5)
1. **1234** - Too short for most systems
2. **ABCDE** - Letters only (invalid for US)
3. **12345-67890** - Too long
4. **12 345** - Space in wrong position
5. **@#$%^** - Special characters only

### 🎯 Tricky Values (3)
1. **00000**
   - *Testing:* All zeros (technically valid US ZIP but unusual)
2. **H0H 0H0**
   - *Testing:* Santa Claus postal code (Canada Post official)
3. **90210-0000**
   - *Testing:* Valid ZIP+4 with zeros in extension

---

## 📱 Phone Number

### ✅ Valid Examples (5)
1. **+1-555-123-4567** - US number with country code
2. **(555) 123-4567** - US number with parentheses
3. **555.123.4567** - US number with dots
4. **+44 20 7946 0958** - UK number
5. **+49 30 12345678** - German number

### ❌ Invalid Examples (5)
1. **123** - Too short
2. **555-CALL-NOW** - Contains letters (some systems don't support)
3. **+1-555-123-456789** - Too long
4. **555--123--4567** - Double hyphens
5. **phone number** - Text instead of numbers

### 🎯 Tricky Values (3)
1. **911**
   - *Testing:* Emergency number handling (might be blocked)
2. **+1-800-MY-APPLE**
   - *Testing:* Vanity number with letters
3. **+999-999-999-9999**
   - *Testing:* Invalid country code (+999 doesn't exist)

---

## 📧 Email Address

### ✅ Valid Examples (5)
1. **user@example.com** - Standard email
2. **firstname.lastname@company.co.uk** - Professional email with subdomain
3. **user+tag@gmail.com** - Email with plus addressing
4. **very.long.email.address@very.long.domain.name.com** - Long but valid
5. **user123@sub.domain.info** - Alphanumeric with subdomain

### ❌ Invalid Examples (5)
1. **user@** - Missing domain
2. **@domain.com** - Missing username
3. **user.domain.com** - Missing @ symbol
4. **user@domain** - Missing TLD
5. **user@domain..com** - Double dot in domain

### 🎯 Tricky Values (3)
1. **test@[192.168.1.1]**
   - *Testing:* IP address as domain (technically valid but rare)
2. **"john..doe"@example.com**
   - *Testing:* Quoted local part with consecutive dots
3. **user@xn--nxasmq6b.xn--o3cw4h**
   - *Testing:* Internationalized domain name (Punycode)

---

## 🖼️ Profile Picture (File Upload)

### ✅ Valid Examples (5)
1. **profile.jpg** - Standard JPEG (1MB, 500x500px)
2. **avatar.png** - PNG format (800KB, 300x300px)
3. **photo.gif** - GIF format (500KB, 200x200px)
4. **headshot.webp** - Modern WebP format (400KB, 400x400px)
5. **picture.jpeg** - JPEG with full extension (1.5MB, 600x600px)

### ❌ Invalid Examples (5)
1. **document.pdf** - Wrong file type
2. **huge_image.jpg** - Too large (25MB)
3. **tiny.jpg** - Too small (50x50px below minimum)
4. **corrupted.jpg** - Corrupted file header
5. **malware.exe** - Executable file disguised as image

### 🎯 Tricky Values (3)
1. **image_with_very_long_filename_that_exceeds_normal_limits_and_might_cause_issues.jpg**
   - *Testing:* Maximum filename length handling
2. **имя_файла.jpg** (Cyrillic filename)
   - *Testing:* Unicode filename support
3. **transparent.png** (1x1px transparent PNG)
   - *Testing:* Minimum viable image that's technically valid but useless

---

## 📊 Testing Strategy by Category

### **High Priority Edge Cases**
- Date boundaries (leap years, age limits)
- International character sets (Unicode)
- Security vulnerabilities (XSS, file uploads)

### **Medium Priority Edge Cases**  
- Format variations (phone numbers, addresses)
- Length boundaries (very long/short values)
- Cultural sensitivities (gender, countries)

### **Low Priority Edge Cases**
- Unusual but valid formats
- Historical or rare cases
- Comedy/stress testing values

---

## 🎯 Quick Reference Summary

| Field Type | Main Risks | Key Tests |
|------------|------------|-----------|
| **Full Name** | Unicode, XSS, Length | Special characters, very long names |
| **Date of Birth** | Invalid dates, Age logic | Leap years, future dates, age boundaries |
| **Gender** | Inclusivity, Validation | Non-standard options, case sensitivity |
| **Country** | Political sensitivity, Validation | Disputed territories, obsolete countries |
| **City** | Length, Unicode | Very long names, special characters |
| **Address** | Injection, Format | XSS attempts, international formats |
| **Postal Code** | Format validation | Different country formats, edge cases |
| **Phone** | Format, Length | International formats, vanity numbers |
| **Email** | RFC compliance, Security | Edge cases per RFC, injection attempts |
| **Profile Picture** | File security, Size | File type validation, malicious uploads |

---

**Cheat Sheet Version:** 1.0  
**Created:** November 6, 2025  
**Total Test Cases:** 100 (10 fields × 10 cases each)  
**Coverage:** Functional, Security, Internationalization, Edge Cases