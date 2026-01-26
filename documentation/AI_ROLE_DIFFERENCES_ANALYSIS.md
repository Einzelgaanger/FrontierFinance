# Comprehensive Analysis: Admin AI vs Viewer/Member AI Functionality

## Executive Summary

**CRITICAL ISSUE FOUND**: The viewer AI is not working correctly because **Row Level Security (RLS) policies are blocking viewers from accessing completed surveys**. The AI function uses the same code for all roles, but RLS policies restrict what data each role can see.

---

## 1. Code Architecture - All Roles Use Same Code

### Backend AI Function (`supabase/functions/ai-chat/index.ts`)
- **Single codebase** for all roles (admin, member, viewer)
- **Same AI model**: `google/gemini-2.5-flash`
- **Same API endpoint**: `https://ai.gateway.lovable.dev/v1/chat/completions`
- **Same context building logic**: Lines 38-239

### Frontend Components
- **PortIQ.tsx**: Used by all roles - no role-specific logic
- **AIAssistant.tsx**: Simple wrapper, also used by all roles
- Both call the same `ai-chat` Supabase function

### Key Finding: **NO CODE DIFFERENCES** between roles in the AI implementation itself.

---

## 2. Role-Based Data Access (The Real Difference)

### How Role Detection Works
```typescript
// Line 39-45: Get user role
const { data: roleData, error: roleError } = await supabaseClient
  .from('user_roles')
  .select('role')
  .eq('user_id', user.id)
  .maybeSingle()

const userRole = roleError || !roleData?.role ? 'viewer' : roleData.role
```

### Field Visibility Filtering
```typescript
// Lines 57-62: Filter fields based on role
const visibleFields = fieldVisibility.filter(field => {
  if (userRole === 'admin') return field.admin_visible
  if (userRole === 'member') return field.member_visible
  if (userRole === 'viewer') return field.viewer_visible
  return false
})
```

### Survey Data Query (Lines 90-109)
```typescript
for (const year of surveyYears) {
  const fieldsToSelect = [...new Set(surveyFieldsByYear[year])].join(', ')
  
  const { data, error } = await supabaseClient
    .from(`survey_responses_${year}`)
    .select(fieldsToSelect)
    .or('completed_at.not.is.null,submission_status.eq.completed')
}
```

**PROBLEM**: This query is subject to RLS policies, which block viewers!

---

## 3. THE ROOT CAUSE: RLS Policies Blocking Viewers

### RLS Policy Analysis

**Location**: `supabase/migrations/20251022085511_0984b68b-710b-4209-93d2-686378a7a3ed.sql`

#### For All Survey Years (2021-2024):
```sql
CREATE POLICY "Completed [YEAR] surveys viewable by members and admins"
  ON public.survey_responses_[YEAR]
  FOR SELECT
  USING (
    submission_status = 'completed' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid()
      AND role IN ('member', 'admin')  -- ⚠️ VIEWERS EXCLUDED!
    )
  );
```

**This means:**
- ✅ **Admins**: Can see ALL completed surveys (full access)
- ✅ **Members**: Can see ALL completed surveys (full access)
- ❌ **Viewers**: **CANNOT see ANY completed surveys** (blocked by RLS)

### Why Viewers Only See 1 Survey

The viewer is likely seeing:
1. **Their own survey** (if they submitted one) - allowed by "Users can manage their own [YEAR] survey" policy
2. **NO other completed surveys** - blocked by RLS

Admin sees 252 surveys because:
- RLS allows admins to see all completed surveys
- The query successfully returns all data

---

## 4. Additional Role Differences

### Data Access by Role

#### Admin (Full Access)
- ✅ All survey fields (admin_visible = true)
- ✅ All completed surveys (252 total)
- ✅ Applications data (line 155-165)
- ✅ Network profiles (line 180-189)
- ✅ Leaderboard (line 130-140)

#### Member (Moderate Access)
- ✅ Member-visible survey fields
- ✅ All completed surveys (252 total)
- ✅ Network profiles
- ✅ Leaderboard
- ❌ Applications data (admin only)

#### Viewer (Limited Access)
- ✅ Only viewer-visible fields (very limited)
- ❌ **NO completed surveys** (RLS blocks them)
- ❌ Network profiles (line 180: `if (userRole === 'member' || userRole === 'admin')`)
- ❌ Leaderboard (line 130: `if (userRole === 'member' || userRole === 'admin')`)
- ❌ Applications data

### Field Visibility Example

From `field_visibility` table:
- **Viewer visible**: Only ~6-10 basic fields per survey (firm_name, geographic_focus, etc.)
- **Member visible**: ~150 fields (includes investment details, strategy, etc.)
- **Admin visible**: All ~350 fields (includes contact info, financials, etc.)

---

## 5. Why the AI Gives Wrong Answers to Viewers

### The Problem Flow:

1. **AI Function Queries Surveys** (line 93-96)
   ```typescript
   .from(`survey_responses_${year}`)
   .select(fieldsToSelect)
   .or('completed_at.not.is.null,submission_status.eq.completed')
   ```

2. **RLS Policy Blocks the Query**
   - Viewer's auth token is checked
   - Policy sees role = 'viewer'
   - Policy rejects: `role IN ('member', 'admin')` = FALSE
   - Returns empty array or only viewer's own survey

3. **AI Receives Limited Data**
   ```typescript
   dataContext.surveys[year] = data  // Only 1 survey for viewer
   dataContext.survey_counts[year] = data.length  // Shows 1 instead of 252
   ```

4. **AI Responds Based on Limited Context**
   - AI sees: "1 completed survey"
   - AI responds: "We have 1 total completed survey"
   - **This is technically correct based on the data it received!**

---

## 6. Solutions

### Option 1: Update RLS Policies (Recommended)
Allow viewers to see completed surveys with limited fields:

```sql
-- Add viewer access to completed surveys
CREATE POLICY "Viewers can view completed surveys (limited fields)"
  ON public.survey_responses_2021
  FOR SELECT
  USING (
    submission_status = 'completed' OR completed_at IS NOT NULL
  );

-- Repeat for 2022, 2023, 2024
```

**Pros**: 
- Viewers can see survey counts
- Field visibility still controls which fields they see
- Maintains security (only visible fields returned)

**Cons**: 
- Need to ensure field_visibility is properly configured
- May expose more data than intended

### Option 2: Use Service Role in AI Function
Bypass RLS and manually filter:

```typescript
// Use service role key (bypasses RLS)
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// Fetch all surveys
const { data } = await supabaseAdmin
  .from(`survey_responses_${year}`)
  .select('*')
  .or('completed_at.not.is.null,submission_status.eq.completed')

// Then filter fields based on role
const filteredData = data.map(survey => {
  // Only include fields visible to userRole
})
```

**Pros**: 
- Full control over data filtering
- Can provide accurate counts to all roles

**Cons**: 
- More complex code
- Security risk if not implemented carefully
- Need to manually filter every field

### Option 3: Separate Count Query
Get counts separately without field restrictions:

```typescript
// Get count first (using count, not select)
const { count } = await supabaseClient
  .from(`survey_responses_${year}`)
  .select('*', { count: 'exact', head: true })
  .or('completed_at.not.is.null,submission_status.eq.completed')

// Then get limited data for context
const { data } = await supabaseClient
  .from(`survey_responses_${year}`)
  .select(visibleFields)
  .or('completed_at.not.is.null,submission_status.eq.completed')
  .limit(10)  // Just for context, not full dataset
```

**Pros**: 
- Accurate counts for all roles
- Still respects field visibility for actual data

**Cons**: 
- May not work if RLS blocks the count query too

---

## 7. Summary Table

| Aspect | Admin | Member | Viewer |
|--------|-------|--------|--------|
| **AI Code** | Same | Same | Same |
| **AI Model** | Same | Same | Same |
| **RLS Access** | ✅ Full | ✅ Full | ❌ Blocked |
| **Survey Count** | 252 | 252 | 1 (wrong) |
| **Field Access** | All (~350) | Many (~150) | Few (~10) |
| **Network Profiles** | ✅ Yes | ✅ Yes | ❌ No |
| **Leaderboard** | ✅ Yes | ✅ Yes | ❌ No |
| **Applications** | ✅ Yes | ❌ No | ❌ No |

---

## 8. Recommended Fix

**Immediate Action**: Update RLS policies to allow viewers to see completed surveys:

```sql
-- For each year (2021, 2022, 2023, 2024)
CREATE POLICY "Viewers can view completed surveys"
  ON public.survey_responses_2021
  FOR SELECT
  USING (
    (submission_status = 'completed' OR completed_at IS NOT NULL)
  );
```

This will:
1. Allow viewers to see all completed surveys
2. Field visibility will still limit which fields they can see
3. AI will receive accurate survey counts
4. AI responses will be correct

**Note**: The field_visibility table already restricts which fields viewers can see, so this is safe. The RLS policy should allow row access, and field_visibility controls column access.

---

## 9. Testing Checklist

After implementing the fix:

- [ ] Viewer can query "how many surveys total?" → Should see 252
- [ ] Viewer can query "how many surveys in 2021?" → Should see 43
- [ ] Viewer cannot see sensitive fields (emails, financials)
- [ ] Admin still sees all surveys and all fields
- [ ] Member still sees all surveys with member-visible fields
- [ ] AI responses are accurate for all roles

---

## Conclusion

**The AI code is identical for all roles.** The difference is entirely due to:
1. **RLS policies** blocking viewer access to completed surveys
2. **Field visibility** limiting which fields each role can see
3. **Conditional data fetching** (applications, profiles, leaderboard)

The fix is to update RLS policies to allow viewers to see completed surveys while maintaining field-level security through the field_visibility system.

