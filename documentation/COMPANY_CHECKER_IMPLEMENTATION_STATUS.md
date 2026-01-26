# Company Checker Implementation Status

## Overview
AI-assisted sign-up flow that checks if a company exists in the system and consolidates survey data under one account.

## ✅ Implemented Features

### 1. AI Assistant Flow (`CompanyCheckerChat.tsx`)
- ✅ Shows automatically when user clicks "Sign Up"
- ✅ Asks user for company name
- ✅ Searches across all survey years (2021-2024)
- ✅ Finds exact and similar company name matches
- ✅ Allows user to select multiple company name variations
- ✅ User can confirm "yes" or "no" (proceed to normal signup)
- ✅ Shows all emails associated with selected companies
- ✅ User selects primary email
- ✅ Consolidates all surveys to selected email
- ✅ Creates user account with default password
- ✅ Links all surveys to user_id
- ✅ Returns default password for sign-in

### 2. Backend Function (`company-lookup/index.ts`)
- ✅ **Action: 'search'** - Searches all survey years for company names
  - Searches `survey_responses_2021` (firm_name)
  - Searches `survey_responses_2022` (organisation)
  - Searches `survey_responses_2023` (organisation_name, fund_name)
  - Searches `survey_responses_2024` (organisation_name, fund_name)
  - Returns unique company names (case-insensitive)

- ✅ **Action: 'getEmails'** - Gets all emails for selected companies
  - Finds all emails across all survey years
  - Returns email, company name, and year for each

- ✅ **Action: 'consolidate'** - Consolidates surveys and creates user
  - Checks if user exists with primary email
  - Creates new auth user if doesn't exist
  - Creates user profile in `user_profiles` table
  - Assigns default 'viewer' role
  - Updates all survey records:
    - Updates email addresses to primary email
    - Links surveys to user_id (handles UNIQUE constraint)
    - For each year, keeps first survey found if multiple exist
  - Returns default password: `@ESCPNetwork2025#`

### 3. Frontend Integration (`AuthForm.tsx`)
- ✅ Company checker shows automatically on signup tab
- ✅ Handles completion callback
- ✅ Pre-fills sign-in form when consolidation succeeds
- ✅ Switches to sign-in tab automatically
- ✅ Shows success message with default password

## 🔄 Flow Summary

1. **User clicks "Sign Up"** → Company checker automatically appears
2. **AI asks:** "What is your company or fund name?"
3. **User enters company name** → AI searches database
4. **AI shows results:**
   - If found: Shows matching companies (user can select multiple)
   - If not found: Proceeds to normal signup
5. **User confirms selection** → AI gets all emails for those companies
6. **AI shows emails** → User selects primary email
7. **User confirms** → AI consolidates:
   - Creates/updates user account
   - Links all surveys to user_id
   - Updates email addresses
8. **AI shows default password** → User signs in with credentials

## 📋 Database Tables Used

### Survey Tables
- `survey_responses_2021` (firm_name, email_address, user_id)
- `survey_responses_2022` (organisation, email, user_id)
- `survey_responses_2023` (organisation_name, fund_name, email_address, user_id)
- `survey_responses_2024` (organisation_name, fund_name, email_address, user_id)

### User Tables
- `auth.users` - Authentication
- `user_profiles` - User profile data
- `user_roles` - User role assignments

## ⚠️ Important Constraints

1. **UNIQUE user_id per survey year**: Each user can only have one survey per year
   - Solution: When multiple surveys exist for same year, keeps first one found
   - Updates email address for all matching surveys

2. **Email consolidation**: All surveys with matching company names get updated to primary email

3. **User creation**: Creates new user if doesn't exist, uses existing if found

## 🎯 Default Password
- **Password:** `@ESCPNetwork2025#`
- User can change password after signing in

## ✅ Status: FULLY IMPLEMENTED

All logic described in the requirements has been implemented:
- ✅ AI assistant flow
- ✅ Company name search across all years
- ✅ Similar name matching
- ✅ Multiple company selection
- ✅ Email retrieval and selection
- ✅ Survey consolidation
- ✅ User account creation
- ✅ Default password assignment
- ✅ Automatic sign-in flow

## 🧪 Testing Checklist

- [ ] Test with company that exists in one survey year
- [ ] Test with company that exists in multiple survey years
- [ ] Test with similar company names (e.g., "Tuliv" vs "tuliv")
- [ ] Test with company that doesn't exist (should proceed to normal signup)
- [ ] Test email selection and consolidation
- [ ] Test user account creation
- [ ] Test sign-in with default password
- [ ] Verify all surveys appear under consolidated account
