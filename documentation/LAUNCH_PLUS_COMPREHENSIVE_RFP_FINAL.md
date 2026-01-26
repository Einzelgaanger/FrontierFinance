# LAUNCH+ PLATFORM
## Request for Proposal - Final Comprehensive Specification
## Digital Ecosystem for Small Business Growth Fund Acceleration

---

## Document Information
- **Project Name:** LAUNCH+ Platform - Integrated Digital Ecosystem
- **Program:** LAUNCH+ Initiative (€16.5M, Oct 2025 - Dec 2027)
- **Version:** FINAL RFP Edition
- **Date:** November 2025
- **Prepared For:** Collaborative for Frontier Finance (CFF)
- **Procurement Type:** Platform Development & Technology Partnership
- **RFP Response Deadline:** [To be specified]
- **Document Status:** Final for Vendor Bidding

---

## Executive Summary

### Program Context

The LAUNCH+ Platform operationalizes the Collaborative for Frontier Finance's €16.5M LAUNCH+ Initiative - a market creation program designed to accelerate 20-30 Small Business Growth Funds (SBGFs) across Africa over 27 months (Oct 2025 - Dec 2027). The platform serves as the operational backbone for an integrated Variable Capital Company (VCC) domiciled in Mauritius, combining shared services, technical assistance, capital deployment, and knowledge management.

**The Challenge:**
Africa's small and growing businesses create 7 out of 10 formal jobs but face a systemic capital gap. Over 100 Small Business Growth Funds seek $2.25B to finance these businesses, yet have only accessed ~$790M (~33%). Fund managers face prohibitive operational costs, lengthy licensing processes (6-12 months), and limited access to institutional capital.

**The LAUNCH+ Solution:**
An integrated VCC platform providing:
1. **Shared Services & Fund Administration**: Turnkey sub-fund setup with FSC licensing, reducing costs by 40-60% and time-to-market to 2-3 months
2. **Technical Assistance (€1M)**: Peer learning, expert coaching, diagnostics, capacity building
3. **Warehousing Capital (€6M)**: Catalytic investment capital to demonstrate capabilities to LPs
4. **Operating Support (€4M)**: OpEx funding for team building and operational readiness
5. **Learning Lab (€2M)**: Knowledge platform with case studies, analytics, LP engagement

**Expected Impact:**
- 20-30 fund managers accelerated toward first close with institutional investors
- Collective AUM of $900M-$1.5B mobilized
- Financing deployed to 4,500+ small businesses
- Job creation: 37%+ increase in direct jobs, 47%+ in indirect jobs
- Inclusive growth: 55% first-time employees, 40% women, 75% youth

---

## Critical Platform Requirements (Based on Program Design)

### 1. Phased Modular Architecture

The platform MUST be built with clear modular phases that can be deployed sequentially:

**Phase 1: Application & Assessment (PRIORITY - Launch Dec 2025, Go-Live Jan 2026)**
- Application portal with document management
- AI-assisted scoring and assessment (with human oversight)
- Fund manager eligibility determination
- Investment Committee decision workflows
- Cohort selection and onboarding

**Phase 2: Post-Onboarding Management (Launch Q2 2026)**
- Periodic reporting to Mauritius fund administrator (quarterly/semi-annual)
- Capital deployment tracking (warehousing + opex loans)
- Portfolio company impact monitoring (4,500+ businesses)
- TA program delivery coordination
- Learning Lab content delivery

**Phase 3: Ecosystem Integration (2026-2027)**
- Annual fund manager survey tool
- Benchmarking and analytics across network
- LP matching engine
- Knowledge management and research dissemination

### 2. Core Technology Philosophy

**What We Need:**
- **NOT a mock application** - Real, production-ready platform with AI capabilities
- **Clean, smooth front-end** - Fund managers must find process intuitive and professional
- **Manual document upload** - We want specific documentation uploaded by managers (NOT AI extraction from websites/pitch decks)
- **Cohort-based workflows** - Assessment criteria must be configurable per cohort
- **Fluid assessment criteria** - Scoring models will evolve based on market learnings
- **Integration-ready** - Must interface with Mauritius fund administrator systems
- **Data interoperability** - Fund managers may use platform for their own portfolios (optional)

**What We're NOT Looking For:**
- AI that searches websites/pitch decks to auto-populate applications
- Learning Management System (we'll use Notion/similar for that)
- Everything app approach - focused, modular solutions preferred

### 3. Technology Partnership Model

CFF seeks a **technology partnership**, not just software development. We recognize two potential approaches:

**Option A: Turnkey Solution with Technology Partner**
Partner with established fund management platform (e.g., Vula or equivalent) that provides:
- Proven infrastructure for fund/application management
- AI-assisted assessment and scoring
- 24/7 support and automatic system upgrades
- Implementation timeline: 6-8 weeks
- Cost structure: Implementation fee (<$10K) + SaaS fee ($1K-$10K/month, likely lower end)

**Option B: Custom Development with Long-Term Maintenance**
Build custom solution with vendor who commits to:
- Initial development and deployment
- Ongoing maintenance and support
- Feature upgrades as program evolves
- Clear handover and documentation
- Risk: Most TAs/funds who try this approach end up switching to turnkey solutions

**Vendors must specify which approach they're proposing and justify their recommendation.**

---

## Detailed Functional Requirements

### Module 1: Fund Manager Application Portal

#### 1.1 Eligibility Assessment Form
**Purpose:** Quick screening to identify fund managers at appropriate stage for LAUNCH+ support

**Required Fields:**
- Basic Information: Name, email, fund name, organization
- Fund Stage Classification (dropdown):
  - Concept Stage → Auto-reject with guidance
  - Pilot Stage → Eligible
  - Implementation Stage → Eligible
  - Scaling Stage → Auto-reject with guidance
- Geographic focus (multi-select): Target African countries/regions
- Legal status: Current domicile and legal structure
- Capital raised to date (by source category)
- Portfolio overview: # investments, ticket sizes, sectors
- Program expectations (250-word text field)

**Functionality:**
- Progress auto-save (every 30 seconds)
- Mobile-responsive design
- Clear instructions per field
- Automatic eligibility determination based on fund stage
- Email confirmation on submission
- Data validation and sanitization

**Success Criteria:**
- Completion time <20 minutes
- Zero data loss during completion
- Clear communication of eligibility outcome

---

#### 1.2 Full Application Questionnaire
**Purpose:** Comprehensive assessment for eligible fund managers

**Required Sections (10 total):**

1. **Team and Capacities**
   - Management team CVs (upload PDFs)
   - Track record and experience
   - Team composition and diversity metrics
   - GP commitment level

2. **Finance and Operations**
   - Budget models and financial projections
   - Current team size and expansion plans
   - IT systems and operational infrastructure
   - OpEx burn rate and runway

3. **Governance and Advisors**
   - Legal documentation (articles, agreements)
   - Board structure and composition
   - Investment committee setup
   - ESG policies and frameworks

4. **Capitalization**
   - Cap table (upload)
   - Fundraising status and timeline
   - Existing LP commitments
   - Target fund size and round

5. **Business Development**
   - Pitch deck (upload, max 20MB)
   - Private Placement Memorandum
   - Term sheets and investment documentation
   - Investor pipeline and engagement status

6. **Pipeline Development**
   - Deal sourcing strategy
   - Pipeline database/CRM
   - Geographic and sector focus
   - Target business stage and ticket size

7. **Investment Process**
   - Investment thesis and strategy
   - Screening criteria and process
   - Due diligence framework
   - Investment structure preferences (equity, debt, RBF, etc.)

8. **Portfolio Management**
   - Exit strategy and timeline
   - Post-investment support model
   - Portfolio monitoring framework
   - Value-add services provided

9. **Impact Measurement**
   - Theory of change (upload or describe)
   - ESG integration approach
   - Impact metrics tracked
   - SDG alignment (select up to 3 primary goals)

10. **Capacity Development Needs**
    - Priority TA areas (rank 1-5)
    - Operational support requirements
    - Knowledge gaps and training needs
    - Peer learning interests

**Document Upload Requirements:**
- Pitch deck (PDF, max 20MB)
- Team CVs (PDF bundle, max 10MB)
- Cap table (Excel or PDF, max 5MB)
- PPM if available (PDF, max 15MB)
- Optional: Video introduction (max 3 minutes, 100MB)

**Functionality:**
- Section-by-section navigation
- Progress indicator (% complete)
- Save and return capability
- Document versioning (track uploads)
- Preview before final submission
- Edit capability before review deadline

**Success Criteria:**
- Intuitive navigation (<3 clicks to any section)
- Clear field instructions
- No document upload failures
- Ability to complete over multiple sessions

---

### Module 2: AI-Assisted Assessment & Scoring

#### 2.1 Automated Scoring Engine
**Purpose:** Provide initial assessment scores to prioritize CFF review queue

**Scoring Methodology:**
CFF has developed a comprehensive scoring matrix (see Appendix A for full details). Key criteria include:

**Primary Criteria (100 points total):**
- Geography Relevance (0-1 points): Africa-focused operations
- Fund Stage (0-1): Pilot or Implementation stage
- ESG Policy (0-1): Documented ESG framework
- Existing Local Vehicle (0-1): Legal entity established
- Readiness to Execute (0-15): Pipeline, team, systems ready
- Early CFF Assessment (0-10): Network familiarity and alignment
- Need for New Structure (0-10): Benefit from VCC platform
- Team Diversity (0-15): Gender, geography, experience diversity
- GP Commitment (0-5): Skin in the game
- Fund Round (0-5): First or second fund
- Existing LP Capital (0-5): Commitments or strong pipeline
- Investment Policy (0-10): Clarity and appropriateness of thesis
- ESG Integration (0-5): Beyond policy to practice
- Business Plan (0-10): Clarity, realism, market understanding
- Impact Framework (0-10): Robust measurement approach
- Financial Projections (0-10): Credibility and realism

**Secondary Criteria (50 points total):**
- Board Composition
- Risk Management
- Portfolio Concentration
- Compliance Framework
- Reporting Capability
- Technology Infrastructure
- Network Engagement

**AI Requirements:**
- Automatically score applications based on submitted data
- Flag missing information required for scoring
- Provide confidence level for each score
- Generate written justification for scores (2-3 sentences per criterion)
- Allow human override of any AI-generated score
- Track scoring changes and audit trail

**Threshold-Based Workflows:**
- Score >75: Automatically advance to detailed review
- Score 50-75: Human review required
- Score <50: Automatically reject with constructive feedback

**Human-in-the-Loop:**
- All scores are recommendations only
- Analysts can adjust any score
- IC has final decision authority
- AI learns from human corrections over time (optional future enhancement)

---

#### 2.2 Reviewer Assessment Workflow
**Purpose:** Enable CFF staff and external reviewers to conduct thorough evaluations

**Reviewer Capabilities:**
- View complete application with all documents
- Add private notes and commentary (not visible to applicant)
- Adjust AI-generated scores with justification
- Flag concerns or red flags
- Compare applications side-by-side (up to 3 at once)
- Generate reviewer report for IC

**Review Assignment:**
- Operations staff assign applications to specific reviewers
- Multiple reviewers per application (typically 2-3)
- Notification system when review is assigned
- Deadline tracking and reminders

**Review Interface Requirements:**
- Single-page view of complete application
- Collapsible sections for easy navigation
- Document preview (no download required for common formats)
- Annotation capability on documents
- Score adjustment sliders with justification text fields
- Save draft and submit final review

---

#### 2.3 Investment Committee Dashboard
**Purpose:** Enable IC members to review applications and make cohort decisions

**IC Dashboard Features:**
- List view of all applications under IC review
- Sortable by score, submission date, reviewer recommendations
- Color coding: Green (recommend), Yellow (borderline), Red (concerns)
- One-click access to executive summary
- Voting functionality: Approve / Reject / Defer
- Comment capability for IC discussion
- Quorum tracking (% of IC members who have voted)

**Executive Summary Auto-Generation:**
AI must generate 1-page executive summary including:
- Fund manager name and stage
- Investment thesis (2-3 sentences)
- Key strengths (3-5 bullet points)
- Key concerns (3-5 bullet points)
- Overall score and reviewer consensus
- Recommendation: Strong accept / Accept / Borderline / Reject

**Success Criteria:**
- IC can review 20+ applications in 2-hour meeting
- All decision-making information in one place
- Decisions are documented and auditable

---

### Module 3: Post-Onboarding Management (Phase 2)

#### 3.1 Periodic Reporting System
**Purpose:** Collect required reports from fund managers for Mauritius fund administrator

**Reporting Frequency:**
- Quarterly or semi-annual (configurable per fund)
- Automatic reminders 2 weeks, 1 week, 3 days before deadline
- Escalation alerts if overdue

**Required Report Sections:**
- Portfolio updates (new investments, exits, write-offs)
- Financial performance (NAV, IRR, multiples)
- Impact metrics (jobs, gender, SDG progress)
- Team updates (hiring, departures, capacity)
- Challenges and support needs

**Functionality:**
- Pre-populated templates based on prior submissions
- Document upload for supporting materials
- Version control and submission history
- Admin approval workflow before transmission to fund administrator

---

#### 3.2 Capital Deployment Tracking
**Purpose:** Manage €10M in warehousing loans and opex support

**Warehousing Capital Module:**
- Application for warehousing line (€200K-€400K per fund)
- Investment-by-investment approval workflow
- Disbursement tracking and documentation
- Repayment schedule management
- Portfolio company performance tracking

**OpEx Support Module:**
- Application for opex funding (€100K-€200K per fund)
- Milestone-linked disbursement (e.g., after hiring key team member)
- Expense reporting and approval
- Repayment tracking (for loans) or grant documentation
- Utilization analytics

**Key Requirements:**
- Integration with fund administrator for financial reconciliation
- Document management for legal agreements
- Alert system for upcoming repayments
- Dashboard showing total deployed capital, repayments, defaults

---

#### 3.3 Portfolio Company Impact Dashboard
**Purpose:** Track impact across 4,500+ portfolio companies financed by supported funds

**Impact Metrics Collected:**
- Jobs created (direct and indirect)
- Gender distribution (% women employed, % women-led businesses)
- Youth employment (% under 35)
- First-time employment (% employees in first formal job)
- SDG alignment and progress
- Revenue growth of portfolio companies
- Survival/failure rates

**Data Collection Methods:**
- Fund managers report quarterly on portfolio
- Standardized templates for consistency
- Data validation rules (e.g., job totals must reconcile)
- Optional: Direct integration if fund manager uses compatible platform

**Analytics and Reporting:**
- Aggregate impact dashboard (all funds, all portfolio companies)
- Fund-by-fund breakdown
- Comparative benchmarks (e.g., your fund vs. cohort average)
- Trend analysis over time
- Export capability for donor/LP reports

---

### Module 4: Learning Lab (Phase 3)

#### 4.1 Case Study Library
**Purpose:** Document and share fund manager innovations and lessons learned

**Case Study Creation Workflow:**
- Template for case study structure
- Collaboration between CFF and fund manager
- Document upload and rich text editing
- Categorization by topic (e.g., deal structuring, portfolio support, exits)
- Publication approval process

**Case Study Features:**
- Searchable database (by topic, geography, fund stage)
- Download as PDF
- Comment/discussion capability (moderated)
- Related case studies recommendations

---

#### 4.2 LP Matching Engine (Optional Enhancement)
**Purpose:** Connect fund managers with appropriate institutional LPs

**Matching Criteria:**
- LP investment thesis (stage, geography, ticket size)
- Fund manager characteristics (thesis, track record, team)
- Automatic match score (0-100%)
- Gap analysis (what information is missing for higher match?)

**Deal Note Generation:**
AI generates 2-3 page deal note explaining:
- Why this fund aligns with LP's investment criteria
- Key strengths and differentiators
- Track record and impact to date
- Investment opportunity (terms, timeline)

**Functionality:**
- Opt-in for fund managers (they control when profile is visible)
- CFF approval before any LP matches are shared
- Communication tracking (when introductions are made)
- Outcome tracking (meetings, due diligence, investments)

---

## Technical Architecture Requirements

### Technology Stack Recommendations

**Frontend:**
- React 18+ with TypeScript
- Tailwind CSS for styling
- React Hook Form + Zod for form management and validation
- React Query for API state management
- Responsive design (mobile-first)

**Backend:**
- Supabase (preferred) or equivalent:
  - PostgreSQL database
  - Row Level Security (RLS) policies
  - Edge functions for serverless logic
  - Realtime subscriptions for live updates
  - Authentication with role-based access

**AI Integration:**
- Lovable AI Gateway or OpenAI GPT-4/GPT-5 for:
  - Application scoring and assessment
  - Executive summary generation
  - Deal note generation
  - Document analysis
- Structured output using function calling (not raw JSON responses)
- Clear prompting with domain-specific guidance
- Human-in-the-loop validation

**File Storage:**
- Supabase Storage or S3-compatible
- Encrypted at rest
- Versioning for document uploads
- CDN for fast global access
- Virus scanning on upload

**Security:**
- End-to-end encryption for sensitive data
- Role-based access control (Admin, Operations, Reviewer, IC, Fund Manager)
- Audit logging of all actions
- GDPR compliance (data retention, right to erasure)
- Two-factor authentication for internal users

### Performance Requirements

- **Page Load Time:** <2 seconds (desktop), <3 seconds (mobile)
- **API Response:** <200ms (p95)
- **File Upload:** 100MB file in <2 minutes
- **Concurrent Users:** 50+ without degradation
- **Uptime:** 99.5%+
- **Database Queries:** <100ms (p95)

### Scalability Strategy

- Serverless edge functions (auto-scale)
- Database read replicas for reporting
- CDN for static assets
- Connection pooling
- Caching strategy (React Query + API caching)

### Integration Requirements

**Must Integrate With:**
1. Mauritius Fund Administrator (specific vendor TBD):
   - Financial reporting data transfer
   - Compliance document submission
   - NAV and performance updates

2. Email Service (e.g., Resend, SendGrid):
   - Transactional emails (confirmations, notifications)
   - Templated communications
   - Bounce/delivery tracking

**Nice to Have:**
3. Accounting Systems (QuickBooks, Xero) - future
4. Calendar Integration (Google Calendar, Outlook) - future
5. CRM Systems (Salesforce) - if partnership scenario emerges

### Data Interoperability

**Critical Requirement:**
Platform must support data interoperability where:
- Parent entity (CFF/VCC) tracks sub-funds
- Sub-funds (optionally) track their portfolio companies
- Data flows up: Portfolio → Fund → VCC → Reporting
- Visibility controls: Funds choose what data to share with VCC
- Supports mixed scenarios: Some funds use platform, others use Excel

**Example Hierarchy:**
```
CFF LAUNCH+ VCC
├── Sub-Fund 1 (uses platform for portfolio tracking)
│   ├── Portfolio Company A
│   ├── Portfolio Company B
│   └── Portfolio Company C
├── Sub-Fund 2 (uses Excel, manually reports)
└── Sub-Fund 3 (uses platform for portfolio tracking)
    ├── Portfolio Company D
    └── Portfolio Company E
```

---

## Implementation Timeline & Milestones

### Phase 1: Application & Assessment (PRIORITY)
**Timeline:** Dec 2025 - Jan 2026 (6-8 weeks)

**Week 1-2: Discovery & Design**
- Requirements validation workshop with CFF team
- User flow mapping and wireframing
- Database schema design
- API architecture planning
- Security and compliance review

**Week 3-4: Core Development**
- Eligibility assessment form
- Full application questionnaire (all 10 sections)
- Document upload system
- User authentication and roles

**Week 5-6: AI Integration**
- Scoring engine development
- Assessment criteria implementation
- Executive summary generation
- Reviewer workflow

**Week 7: Integration & Testing**
- Email notification system
- Fund administrator data export
- End-to-end testing
- Security audit

**Week 8: UAT & Go-Live**
- User acceptance testing with CFF team
- Bug fixes and refinements
- Production deployment
- Training and documentation

**Go-Live Target:** Early January 2026 (aligned with Cohort 1 recruitment)

---

### Phase 2: Post-Onboarding Management (Optional)
**Timeline:** Q2 2026 (8-10 weeks)

**Deliverables:**
- Periodic reporting system
- Capital deployment tracking
- Portfolio impact dashboard
- TA program coordination tools

**Dependency:** CFF will evaluate Phase 1 success before committing to Phase 2

---

### Phase 3: Ecosystem Integration (Optional)
**Timeline:** Q3-Q4 2026 (flexible)

**Deliverables:**
- Annual survey tool
- Benchmarking and analytics
- Learning Lab case study platform
- LP matching engine

**Dependency:** Subject to CFF strategic review and budget availability

---

## Budget & Cost Structure

### Option A: Technology Partnership (Turnkey Solution)
**Recommended for:** Fast deployment, proven infrastructure, ongoing support

**Cost Components:**
1. **Implementation Fee:** €8,000 - €12,000 (one-time)
   - Includes: Discovery, customization, integration, training
   - Timeline: 6-8 weeks

2. **SaaS Fee:** €1,500 - €3,000/month
   - Includes: Platform hosting, 24/7 support, automatic upgrades, maintenance
   - Scales with usage (# of users, storage, AI API calls)

3. **Phase 2/3 Expansions:** €5,000 - €10,000 per module
   - As needed, scoped separately

**Total 3-Year Cost Estimate:** €62,000 - €120,000
- Year 1: €26K - €48K (implementation + 12 months SaaS)
- Year 2: €18K - €36K (SaaS only)
- Year 3: €18K - €36K (SaaS only)

**Pros:**
- Fastest time to market
- Proven platform with existing customers
- Ongoing feature upgrades included
- 24/7 support and maintenance
- Lower risk (established solution)

**Cons:**
- Monthly recurring cost
- Less control over platform features
- Vendor dependency

---

### Option B: Custom Development
**Recommended for:** Maximum control, specific feature requirements, eventual ownership

**Cost Components:**
1. **Phase 1 Development:** €40,000 - €80,000
   - Application portal and assessment system
   - Estimated 500-800 development hours @ €80-100/hour
   - Includes: Design, development, testing, deployment

2. **Phase 2 Development:** €30,000 - €50,000
   - Post-onboarding management features

3. **Phase 3 Development:** €20,000 - €40,000
   - Learning Lab and ecosystem tools

4. **Annual Maintenance & Support:** €15,000 - €30,000/year
   - Bug fixes, security updates, minor enhancements
   - Hosting and infrastructure costs
   - Does NOT include major new features

**Total 3-Year Cost Estimate:** €130,000 - €250,000
- Year 1: €55K - €110K (Phase 1 development + support)
- Year 2: €45K - €80K (Phase 2 development + support)
- Year 3: €30K - €60K (Phase 3 development + support)

**Pros:**
- Full ownership of codebase
- Maximum customization
- No vendor lock-in
- Can hire in-house team later

**Cons:**
- Higher upfront cost
- Longer development timeline
- Ongoing maintenance burden
- Risk of "abandoned" custom software (if vendor relationship ends)

---

### Vendor Decision Criteria

Vendors MUST specify:
1. **Proposed Approach:** Option A (turnkey) or Option B (custom), with justification
2. **Detailed Pricing:** Breakdown by phase/component
3. **Timeline:** Milestones and go-live dates
4. **Team:** Developer profiles, AI expertise, experience with fund management platforms
5. **References:** 2-3 similar projects with contact information
6. **Support Model:** Hours of support included, response time SLAs, escalation process
7. **Risk Mitigation:** How will you handle delays, budget overruns, scope changes?

---

## Evaluation Criteria

CFF will evaluate proposals based on:

1. **Technical Approach (30%)**
   - Suitability of proposed technology stack
   - AI integration strategy and capabilities
   - Scalability and performance plan
   - Security and compliance measures

2. **Experience & Expertise (25%)**
   - Relevant portfolio of similar projects
   - AI/ML capabilities in assessment and scoring
   - Fund management platform experience
   - Africa-focused work (preferred but not required)

3. **Cost & Value (20%)**
   - Total cost of ownership (3 years)
   - Cost breakdown transparency
   - Payment terms flexibility
   - Value for money assessment

4. **Timeline & Delivery (15%)**
   - Realistic timeline for Phase 1
   - Clear milestone definitions
   - Go-live date confidence
   - Resource allocation plan

5. **Support & Maintenance (10%)**
   - Support model and SLAs
   - Training and documentation
   - Upgrade and enhancement process
   - Vendor stability and longevity

---

## Submission Requirements

### Proposal Format
Please submit proposals in the following format:

**Section 1: Executive Summary (2 pages max)**
- Understanding of LAUNCH+ mission and platform purpose
- Recommended approach (Option A or B) with justification
- High-level timeline and cost summary

**Section 2: Technical Approach (5-10 pages)**
- Proposed technology stack with rationale
- System architecture diagram
- AI integration strategy
- Security and compliance plan
- Data interoperability approach
- Integration with fund administrator

**Section 3: Project Plan (3-5 pages)**
- Detailed timeline with milestones
- Resource allocation (team members, hours)
- Dependencies and assumptions
- Risk mitigation strategies

**Section 4: Cost Proposal (2-3 pages)**
- Detailed cost breakdown by phase/component
- Payment schedule
- Assumptions and exclusions
- Optional enhancements with pricing

**Section 5: Company Profile & Experience (3-5 pages)**
- Company background and team bios
- Relevant project case studies (2-3)
- References with contact information
- Financial stability information

**Section 6: Support & Maintenance (2-3 pages)**
- Support model and SLAs
- Training plan
- Documentation deliverables
- Post-launch enhancement process

---

## Appendices

### Appendix A: Complete Scoring Matrix
[Detailed 100-point primary + 50-point secondary scoring criteria]

### Appendix B: Sample Application Data
[Anonymized example of completed application for testing]

### Appendix C: Fund Administrator Integration Requirements
[API specifications or data exchange formats - TBD pending vendor selection]

### Appendix D: CFF Organizational Context
[Background on CFF, team structure, stakeholder ecosystem]

### Appendix E: VCC Legal Structure
[Overview of Mauritius VCC, FSC licensing process, governance requirements]

---

## Questions & Contact

For questions regarding this RFP, please contact:

**Primary Contact:**
Arnold Byarugaba
Chief Operating Officer
Collaborative for Frontier Finance
Email: [to be provided]

**Secondary Contact:**
Gila Norich
Director of Partnerships and Capital Initiatives
Collaborative for Frontier Finance
Email: [to be provided]

**Submission Deadline:** [To be specified]

**Proposal Presentations:** [Dates TBD - shortlisted vendors will be invited]

---

## Closing Remarks

The LAUNCH+ platform represents a transformative opportunity to scale an emerging asset class - Small Business Growth Funds - that is critical to Africa's economic development. By reducing costs, accelerating time-to-market, and providing world-class support, we aim to mobilize $900M-$1.5B in capital to 4,500+ small businesses, creating tens of thousands of jobs with a focus on women and youth.

We seek a technology partner who shares this vision and can deliver a platform that is:
- **Clean and intuitive** for fund managers navigating the application
- **Powerful and intelligent** in AI-assisted assessment
- **Flexible and modular** to evolve with program needs
- **Reliable and secure** to protect sensitive data
- **Scalable** to support 100+ fund applications annually

We look forward to your proposals and to partnering with you to make LAUNCH+ a success.

---

**Document Version:** FINAL RFP Edition
**Date:** November 2025
**Prepared By:** Collaborative for Frontier Finance
**Status:** Open for Vendor Bidding
