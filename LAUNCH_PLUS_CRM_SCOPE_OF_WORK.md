# Launch+ CRM Platform - Scope of Work

## Executive Summary

The Launch+ CRM Platform is a comprehensive fund manager assessment and management system designed to streamline the evaluation, onboarding, and management of Small Business Growth Funds seeking to participate in the LAUNCH+ program. The platform will handle the complete lifecycle from initial eligibility assessment through to ongoing fund manager relationship management.

---

## 1. Project Overview

### 1.1 Purpose
To develop a web-based CRM platform that enables CFF to:
- Assess fund manager eligibility using standardized criteria
- Manage multi-stage application processes
- Score and rank applicants objectively
- Track fund manager relationships and progress
- Generate reports and analytics on the pipeline

### 1.2 Target Users
- **Internal Users**: CFF operations team, investment committee members, administrators
- **External Users**: Fund managers applying to the LAUNCH+ program

---

## 2. Core Modules & Features

### 2.1 Fund Manager Application Portal

#### 2.1.1 Eligibility Assessment Form
**Priority: HIGH**

**Features:**
- Multi-step eligibility questionnaire including:
  - Basic information (name, contact, fund details)
  - Fund stage classification (Concept/Pilot/Implementation/Scaling)
  - Geographic focus and operations
  - Current legal status and domiciliation
  - Capital raised to date (by category)
  - Investment portfolio overview
  - Program expectations (250 words max)
- Automatic eligibility determination
- Stage-appropriate messaging (e.g., concept and scaling stages receive "not right fit" guidance)
- Save progress functionality
- Email notifications on submission

**Technical Requirements:**
- Form validation and data sanitization
- File upload support for basic documentation
- Mobile-responsive design
- Integration with email notification system

**Estimated Development Time:** 40-60 hours
**Estimated Cost:** $3,200 - $4,800

---

#### 2.1.2 Full Application Questionnaire
**Priority: HIGH**

**Features:**
- Comprehensive multi-section application form covering:
  - **Team and Capacities**: Management team CVs, experience, track record
  - **Finance and Operations**: Budget models, team expansion, IT systems
  - **Governance and Advisors**: Legal documentation, board structure, investment committee, policies
  - **Capitalization**: Cap table, fundraising status, investor pipeline
  - **Business Development**: Pitch deck, PPM, term sheets
  - **Pipeline Development**: Sourcing strategy, deal database
  - **Investment Process**: Strategy, investment structure, screening criteria
  - **Portfolio Management**: Exit strategy, post-investment support, monitoring
  - **Impact Measurement**: Theory of change, ESG integration, impact metrics
  - **Capacity Development Needs**: Knowledge and operational support requirements
- Progress tracking across sections
- Document upload functionality (PDFs for: pitch deck, CVs, cap table, PPM, etc.)
- Video upload (max 3 minutes, 100MB limit)
- Auto-save functionality
- Section completion indicators
- Review and submit workflow

**Technical Requirements:**
- Large file handling (video uploads)
- Document versioning
- Secure file storage with access controls
- Multi-section form state management
- Validation rules per section

**Estimated Development Time:** 80-100 hours
**Estimated Cost:** $6,400 - $8,000

---

### 2.2 Scoring & Assessment System

#### 2.2.1 Automated Scoring Engine
**Priority: HIGH**

**Features:**
- Implementation of provided scoring matrix:
  - Primary criteria scoring (max 100 points):
    - Geography Relevance (0-1)
    - Fund Stage (0-1)
    - ESG Policy (0-1)
    - Existing Local Vehicle (0-1)
    - Readiness to Execute (0-15)
    - Early CFF Assessment (0-10)
    - Need for New Structure (0-10)
    - Team Diversity (0-15)
    - GP Commitment (0-5)
    - Fund Round (0-5)
    - Existing LP Capital (0-5)
    - Investment Policy (0-10)
    - Financial Model (0-10)
    - Independent IC (0-5)
    - Interest in Shared Services (0-5)
    - Interest in TA Services (0-5)
  - Secondary criteria (5% bonus each, up to 7 categories):
    - Responsiveness to Communication
    - Impact Framework in Place
    - Clarity of Theory of Change
    - Governance Policies/Charters
    - Board presence
    - Existing PPM
    - Participation in Capacity Building
- Real-time score calculation as data is entered
- Score breakdown visualization
- Configurable scoring rules (admin can adjust weights)
- Score history tracking

**Technical Requirements:**
- Rules engine for flexible scoring logic
- Audit trail for score changes
- Export functionality for scoring reports

**Estimated Development Time:** 60-80 hours
**Estimated Cost:** $4,800 - $6,400

---

#### 2.2.2 Assessment Workflow
**Priority: MEDIUM**

**Features:**
- Multi-stage review process:
  - Initial screening (automated)
  - Detailed review (assigned reviewer)
  - Committee review
  - Final decision
- Reviewer assignment and notifications
- Commenting and annotation system
- Status tracking (Submitted → Under Review → Committee Review → Approved/Rejected/Waitlisted)
- Email notifications at each stage
- Decision rationale documentation
- Applicant communication templates

**Technical Requirements:**
- Workflow engine
- Role-based access control
- Activity logging
- Email template system

**Estimated Development Time:** 40-50 hours
**Estimated Cost:** $3,200 - $4,000

---

### 2.3 CRM & Relationship Management

#### 2.3.1 Fund Manager Database
**Priority: HIGH**

**Features:**
- Comprehensive fund manager profiles including:
  - Contact information and fund details
  - Application history
  - Assessment scores and notes
  - Current program status
  - Document repository
  - Communication history
- Advanced search and filtering:
  - By fund stage, geography, sector, score range
  - By application status
  - By program cohort
- Bulk actions (email, status updates, exports)
- Custom fields and tags
- Activity timeline

**Technical Requirements:**
- Full-text search
- Advanced filtering with saved views
- Data export (CSV, Excel)
- Document management system

**Estimated Development Time:** 50-70 hours
**Estimated Cost:** $4,000 - $5,600

---

#### 2.3.2 Communication Center
**Priority: MEDIUM**

**Features:**
- Email integration for fund manager communications
- Template library for common communications:
  - Application received confirmation
  - Request for additional information
  - Interview scheduling
  - Acceptance/rejection letters
  - Program updates
- Email tracking (sent, opened, clicked)
- Scheduled email campaigns
- SMS notifications (optional)
- In-app messaging

**Technical Requirements:**
- Email service integration (e.g., SendGrid, Resend)
- Template management system
- Email tracking/analytics
- SMS gateway integration (optional)

**Estimated Development Time:** 30-40 hours
**Estimated Cost:** $2,400 - $3,200

---

### 2.4 Cohort Management

#### 2.4.1 Cohort Administration
**Priority: MEDIUM**

**Features:**
- Cohort creation and configuration (Q1 2026, Q2 2026, etc.)
- Fund manager assignment to cohorts
- Cohort-specific dashboards
- Capacity tracking (number of slots per cohort)
- Waitlist management
- Cohort progress tracking
- Group communications to cohort members

**Technical Requirements:**
- Cohort data model
- Bulk assignment tools
- Reporting by cohort

**Estimated Development Time:** 25-35 hours
**Estimated Cost:** $2,000 - $2,800

---

### 2.5 Document Management

#### 2.5.1 Secure Document Repository
**Priority: HIGH**

**Features:**
- Centralized document storage for:
  - Pitch decks
  - CVs and resumes
  - Cap tables
  - PPMs
  - Legal documents
  - Financial models
  - Video presentations
- Document versioning
- Access control (role-based permissions)
- Document preview (PDF, video)
- Download and bulk download
- Document expiration/archive
- Search within documents

**Technical Requirements:**
- Cloud storage integration (Supabase Storage)
- File encryption at rest and in transit
- Virus scanning
- Large file support (video up to 100MB+)
- Document indexing for search

**Estimated Development Time:** 40-50 hours
**Estimated Cost:** $3,200 - $4,000

---

### 2.6 Reporting & Analytics

#### 2.6.1 Dashboard & Analytics
**Priority: MEDIUM**

**Features:**
- Executive dashboard showing:
  - Applications pipeline (funnel visualization)
  - Average scores by stage
  - Geographic distribution
  - Sector/theme distribution
  - Cohort fill rates
  - Time-to-decision metrics
- Customizable reports:
  - Application summary reports
  - Scoring reports
  - Pipeline reports
  - Due diligence reports
- Export functionality (PDF, Excel)
- Scheduled report delivery

**Technical Requirements:**
- Data visualization library (Recharts)
- Report generation engine
- Data export capabilities
- Scheduled job system for automated reports

**Estimated Development Time:** 50-60 hours
**Estimated Cost:** $4,000 - $4,800

---

#### 2.6.2 Due Diligence Reports
**Priority: LOW**

**Features:**
- Automated generation of due diligence summary reports
- Comparison reports (multiple applicants side-by-side)
- Gap analysis reports (highlighting missing information)
- Investment committee briefing packets
- Custom report templates

**Estimated Development Time:** 30-40 hours
**Estimated Cost:** $2,400 - $3,200

---

### 2.7 User Management & Security

#### 2.7.1 Authentication & Authorization
**Priority: HIGH**

**Features:**
- Secure user authentication (email/password, SSO optional)
- Role-based access control:
  - Administrator (full access)
  - Reviewer (assessment access)
  - Committee Member (read + decision access)
  - Operations Staff (CRM access)
  - Applicant (limited to own application)
- Two-factor authentication (optional)
- Password policies
- Session management
- Activity logging and audit trails

**Technical Requirements:**
- Secure authentication system (Supabase Auth)
- RBAC implementation
- Audit logging

**Estimated Development Time:** 25-35 hours
**Estimated Cost:** $2,000 - $2,800

---

### 2.8 Integration & API

#### 2.8.1 External Integrations
**Priority: LOW**

**Features:**
- API for third-party integrations
- Webhook support for external systems
- Export to accounting systems (optional)
- Calendar integration for scheduling (optional)

**Estimated Development Time:** 40-50 hours
**Estimated Cost:** $3,200 - $4,000

---

## 3. Technical Architecture

### 3.1 Technology Stack
- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL database, Authentication, Storage, Edge Functions)
- **Deployment**: Vercel (frontend), Supabase Cloud (backend)
- **Email**: Resend or SendGrid
- **File Storage**: Supabase Storage with CDN
- **Analytics**: Custom analytics dashboard

### 3.2 Security & Compliance
- End-to-end encryption for sensitive data
- GDPR/data protection compliance considerations
- Regular security audits
- Backup and disaster recovery procedures
- Data retention policies

### 3.3 Scalability
- Designed to handle 500+ applications per year
- Support for 50+ concurrent internal users
- Cloud-based infrastructure for automatic scaling
- Performance optimization for large file uploads

---

## 4. Project Timeline

### Phase 1: Foundation (Weeks 1-4)
- Project setup and architecture
- Database schema design
- Authentication system
- Basic UI framework

### Phase 2: Core Application Forms (Weeks 5-8)
- Eligibility assessment form
- Full application questionnaire
- Document upload functionality
- Auto-save and validation

### Phase 3: Scoring & Assessment (Weeks 9-11)
- Scoring engine implementation
- Assessment workflow
- Reviewer interfaces

### Phase 4: CRM & Management (Weeks 12-15)
- Fund manager database
- Search and filtering
- Communication center
- Cohort management

### Phase 5: Reporting & Polish (Weeks 16-18)
- Analytics dashboard
- Report generation
- UI/UX refinements
- Performance optimization

### Phase 6: Testing & Launch (Weeks 19-20)
- Comprehensive testing (unit, integration, UAT)
- Bug fixes and refinements
- Documentation
- Training and handover
- Production deployment

**Total Duration:** 20 weeks (approximately 5 months)

---

## 5. Cost Breakdown

### 5.1 Development Costs

| Module | Priority | Hours | Cost (@ $80/hr) |
|--------|----------|-------|-----------------|
| **Application Portal** |
| Eligibility Assessment Form | HIGH | 40-60 | $3,200 - $4,800 |
| Full Application Questionnaire | HIGH | 80-100 | $6,400 - $8,000 |
| **Scoring & Assessment** |
| Automated Scoring Engine | HIGH | 60-80 | $4,800 - $6,400 |
| Assessment Workflow | MEDIUM | 40-50 | $3,200 - $4,000 |
| **CRM & Relationship Management** |
| Fund Manager Database | HIGH | 50-70 | $4,000 - $5,600 |
| Communication Center | MEDIUM | 30-40 | $2,400 - $3,200 |
| **Cohort Management** | MEDIUM | 25-35 | $2,000 - $2,800 |
| **Document Management** | HIGH | 40-50 | $3,200 - $4,000 |
| **Reporting & Analytics** |
| Dashboard & Analytics | MEDIUM | 50-60 | $4,000 - $4,800 |
| Due Diligence Reports | LOW | 30-40 | $2,400 - $3,200 |
| **User Management & Security** | HIGH | 25-35 | $2,000 - $2,800 |
| **Integration & API** | LOW | 40-50 | $3,200 - $4,000 |
| **Project Management & Testing** | HIGH | 80-100 | $6,400 - $8,000 |
| | | **TOTAL** | **$47,200 - $61,600** |

### 5.2 Recommended Phased Approach

Given budget considerations, we recommend a phased implementation:

#### **Phase 1: MVP (Minimum Viable Product)** - $28,000 - $35,000
Priority: Launch Q4 2025 to support Q1 2026 cohort
- Eligibility Assessment Form (HIGH)
- Full Application Questionnaire (HIGH)
- Automated Scoring Engine (HIGH)
- Fund Manager Database (HIGH)
- Document Management (HIGH)
- User Management & Security (HIGH)
- Basic reporting

**Duration:** 12 weeks
**Features:** Complete application intake, scoring, and basic management

#### **Phase 2: Enhanced CRM** - $12,000 - $15,000
Priority: Q1 2026
- Assessment Workflow (MEDIUM)
- Communication Center (MEDIUM)
- Cohort Management (MEDIUM)
- Dashboard & Analytics (MEDIUM)

**Duration:** 6 weeks
**Features:** Advanced workflow management, enhanced communications

#### **Phase 3: Advanced Features** - $8,000 - $12,000
Priority: Q2 2026
- Due Diligence Reports (LOW)
- Integration & API (LOW)
- Advanced analytics features

**Duration:** 4 weeks
**Features:** Comprehensive reporting and integrations

### 5.3 Infrastructure & Operational Costs

| Item | Annual Cost |
|------|-------------|
| Supabase Pro Plan | $300 - $600 |
| Domain & SSL | $50 |
| Email Service (Resend/SendGrid) | $300 - $1,200 |
| Video/File Storage (additional) | $200 - $600 |
| **Total Annual** | **$850 - $2,450** |

### 5.4 Ongoing Maintenance & Support

**Option 1: Retainer Model**
- 10 hours/month: $800/month ($9,600/year)
- 20 hours/month: $1,500/month ($18,000/year)

**Option 2: Time & Materials**
- $100/hour for ad-hoc support and enhancements
- Estimated annual need: $6,000 - $12,000

---

## 6. Deliverables

1. **Fully functional Launch+ CRM web application** with all specified modules
2. **Database schema and architecture documentation**
3. **User documentation** (user guides for applicants and administrators)
4. **Technical documentation** (API documentation, deployment guide)
5. **Training sessions** (2-3 sessions for CFF team)
6. **Source code repository** with full access
7. **Deployment to production environment**
8. **30-day warranty period** for bug fixes post-launch

---

## 7. Success Metrics

- **Time to process application**: < 2 weeks from submission to initial review
- **User satisfaction**: > 4.5/5 rating from fund managers on application experience
- **System uptime**: > 99.5%
- **Data accuracy**: 100% score calculation accuracy
- **Efficiency gain**: 50% reduction in manual data entry and processing time

---

## 8. Assumptions & Dependencies

### 8.1 Assumptions
1. CFF will provide timely feedback and approvals at key milestones
2. Scoring criteria and weights are finalized before development begins
3. Sample application data available for testing
4. CFF will designate a product owner for decision-making
5. Access to existing branding guidelines and assets

### 8.2 Dependencies
1. CFF to provide email service credentials (Resend API key)
2. CFF to review and approve designs before development
3. CFF to provide test data for scoring validation
4. User acceptance testing to be completed within agreed timeframes

---

## 9. Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep | High | Clear requirements documentation, change request process |
| Scoring complexity | Medium | Early validation of scoring logic with stakeholders |
| Large file uploads (video) | Medium | Use robust cloud storage, implement upload progress indicators |
| User adoption | Medium | Invest in intuitive UI/UX, provide comprehensive training |
| Data security | High | Implement industry-standard security practices, regular audits |

---

## 10. Next Steps

1. **Review and approval** of this scope of work
2. **Kickoff meeting** to finalize requirements and timeline
3. **Contract execution** and project initiation
4. **Design review** of key interfaces (week 2)
5. **Sprint 1** begins (week 3)

---

## 11. Terms & Conditions

### 11.1 Payment Terms
- 30% upon contract signing
- 40% upon completion of Phase 1 (MVP)
- 30% upon final delivery and acceptance

### 11.2 Warranty
- 30-day warranty period for bug fixes
- Excludes new feature requests or requirement changes

### 11.3 Intellectual Property
- Upon final payment, all source code and intellectual property transfers to CFF
- Developer retains right to use generic components in future projects

### 11.4 Change Requests
- Changes to scope require written approval
- Additional costs calculated at $80-$100/hour

---

## Appendices

### Appendix A: Sample Scoring Calculation
[Include detailed example of how scoring works with sample data]

### Appendix B: Data Model Overview
[High-level entity relationship diagram]

### Appendix C: User Roles & Permissions Matrix
[Detailed breakdown of what each role can access/do]

---

**Document Version:** 1.0  
**Date:** November 26, 2025  
**Prepared By:** [Developer Name]  
**For:** Collaborative for Frontier Finance (CFF)  
**Contact:** [Contact Information]

---

## Approval

**Prepared by:**
- Name: _______________________
- Title: _______________________
- Date: _______________________

**Reviewed and Approved by:**
- Name: Arnold Byarugaba
- Title: Chief Operating Officer and Head of Networks
- Date: _______________________

**Client Acceptance:**
- Name: _______________________
- Title: _______________________
- Date: _______________________
