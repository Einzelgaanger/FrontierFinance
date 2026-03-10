import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-slate-400 text-sm">Last updated: March 10, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms of Service ("Terms") govern your access to and use of the Collaborative for Frontier Finance
              ("CFF") platform at frontierfinance.org (the "Platform"). By creating an account, submitting an application,
              or otherwise using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use
              the Platform.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              These Terms constitute a legally binding agreement between you (whether individually or on behalf of the
              organization you represent) and the Collaborative for Frontier Finance.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">2. Definitions</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>"Platform"</strong> refers to the CFF web application, including all features, tools, and services accessible at frontierfinance.org.</li>
              <li><strong>"User"</strong> refers to any individual who creates an account on the Platform.</li>
              <li><strong>"Admin"</strong> refers to CFF staff with full platform management privileges.</li>
              <li><strong>"Member"</strong> refers to approved fund managers and investors with full network access, including survey participation, directory listing, analytics, PortIQ, and community features.</li>
              <li><strong>"Viewer"</strong> refers to users with limited access, typically pending membership approval or granted read-only access to select resources.</li>
              <li><strong>"Company Account"</strong> refers to an organizational account that may have multiple team members with delegated access.</li>
              <li><strong>"Survey Data"</strong> refers to all responses submitted through the Platform's annual survey system.</li>
              <li><strong>"Content"</strong> refers to all text, data, images, documents, and other materials uploaded or submitted to the Platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">3. Account Registration & Membership</h2>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">3.1 Registration</h3>
            <p className="text-muted-foreground leading-relaxed">
              To access the Platform, you must create an account by providing a valid email address, your name, and a
              secure password. You represent that all registration information is accurate, current, and complete.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">3.2 Domain Restrictions</h3>
            <p className="text-muted-foreground leading-relaxed">
              To prevent duplicate organizational accounts, the Platform restricts new registrations from company email
              domains that are already associated with an existing account. If your organization already has an account,
              you should contact your organization's account holder or reach out to{' '}
               <a href="mailto:developer@frontierfinance.org" className="text-primary hover:underline">developer@frontierfinance.org</a>{' '}
              for assistance with account access or data transfer.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">3.3 Membership Application</h3>
            <p className="text-muted-foreground leading-relaxed">
              New users are assigned the "Viewer" role upon registration. To gain full "Member" access to the network
              directory, surveys, analytics, and community features, you must submit a membership application. Applications
              are reviewed by CFF administrators, who may approve, reject, or request additional information at their
              discretion. Rejected applicants are subject to a cooldown period before reapplying.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">3.4 Company Accounts & Team Members</h3>
            <p className="text-muted-foreground leading-relaxed">
              Approved Members may invite team members to their company account. The primary account holder is responsible
              for the actions of all invited team members. Team members' access can be managed, and their activity is logged
              for accountability.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">3.5 Account Security</h3>
            <p className="text-muted-foreground leading-relaxed">
              You are responsible for maintaining the confidentiality of your login credentials and for all activities that
              occur under your account. You must notify us immediately at{' '}
              <a href="mailto:dev@frontierfinance.org" className="text-primary hover:underline">dev@frontierfinance.org</a>{' '}
              upon becoming aware of any unauthorized use of your account.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">4. Platform Features & Acceptable Use</h2>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.1 Network Directory</h3>
            <p className="text-muted-foreground leading-relaxed">
              The network directory displays profiles of Members who have opted to be visible. You agree to use directory
              information solely for legitimate networking, collaboration, and professional purposes within the frontier
              finance ecosystem. Scraping, bulk downloading, or commercial exploitation of directory data is strictly
              prohibited.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.2 Survey System</h3>
            <p className="text-muted-foreground leading-relaxed">
              Members may be invited to participate in annual surveys. By submitting survey responses, you represent that
              the information provided is accurate to the best of your knowledge. Survey data is used for aggregated
              research and analytics. You understand that your responses contribute to ecosystem-level insights and reports.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.3 Analytics & Dashboards</h3>
            <p className="text-muted-foreground leading-relaxed">
              Analytics features present aggregated data derived from survey responses and platform activity. These
              analytics are provided for informational purposes only and do not constitute financial, investment, or
              professional advice. You should not rely solely on platform analytics for investment decisions.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.4 PortIQ AI Assistant</h3>
            <p className="text-muted-foreground leading-relaxed">
              PortIQ is an AI-powered assistant that helps Members explore data and generate insights. AI-generated
              responses are provided as-is and may contain inaccuracies. CFF is not liable for decisions made based on
              AI-generated content. Your interactions with PortIQ are logged and may be used to improve the service.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.5 Community & Blog Features</h3>
            <p className="text-muted-foreground leading-relaxed">
              Members may create blog posts, comment on content, and interact with learning resources. All community
              content must be professional, relevant, and respectful. You must not post content that is defamatory,
              misleading, discriminatory, or violates any applicable law. CFF reserves the right to remove content that
              violates these guidelines without notice.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.6 Learning Hub</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Learning Hub provides educational resources, articles, and market insights. These materials are for
              informational and educational purposes only. CFF does not guarantee the accuracy, completeness, or timeliness
              of learning resources.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.7 Launch Plus Program</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Launch Plus program provides assessment and support services for emerging fund managers. Participation
              is subject to application and acceptance. Data submitted through Launch Plus assessments is governed by this
              agreement and our Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">5. Prohibited Conduct</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Use the Platform for any unlawful purpose or in violation of any applicable laws or regulations.</li>
              <li>Misrepresent your identity, organizational affiliation, or the accuracy of information you provide.</li>
              <li>Attempt to gain unauthorized access to other users' accounts, data, or restricted areas of the Platform.</li>
              <li>Scrape, harvest, or systematically collect data from the Platform without written authorization.</li>
              <li>Upload malicious code, viruses, or any material that could harm the Platform or its users.</li>
              <li>Interfere with or disrupt the Platform's infrastructure, security, or other users' access.</li>
              <li>Share your account credentials with unauthorized third parties or create multiple accounts for the same organization without authorization.</li>
              <li>Use the Platform's data, analytics, or AI-generated insights to compete directly with CFF's services.</li>
              <li>Circumvent domain-based registration restrictions or other security measures.</li>
              <li>Use automated tools, bots, or scripts to interact with the Platform without prior written consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">6. Intellectual Property</h2>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">6.1 Platform Ownership</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Platform, including its design, code, features, documentation, branding, logos, and all proprietary
              technology, is owned by the Collaborative for Frontier Finance and is protected by intellectual property laws.
              You are granted a limited, non-exclusive, non-transferable license to use the Platform in accordance with
              these Terms.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">6.2 User-Generated Content</h3>
            <p className="text-muted-foreground leading-relaxed">
              You retain ownership of content you submit (blog posts, comments, documents). By submitting content, you
              grant CFF a non-exclusive, worldwide, royalty-free license to use, display, reproduce, and distribute your
              content within the Platform and for promotional or research purposes.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">6.3 Survey Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              By submitting survey responses, you grant CFF the right to use, aggregate, anonymize, analyze, and publish
              the data for research, reports, and ecosystem development purposes. Individual survey responses will not be
              publicly disclosed without your consent, but aggregated and anonymized data may be shared in publications
              and presentations.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">6.4 Analytics & Reports</h3>
            <p className="text-muted-foreground leading-relaxed">
              All analytics dashboards, aggregated reports, and insights generated by the Platform are the intellectual
              property of CFF. Members may use analytics for their own professional purposes but may not republish or
              redistribute Platform-generated reports without prior written consent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">7. Disclaimers</h2>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">7.1 No Investment Advice</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Platform provides data, analytics, and networking tools for informational purposes only. Nothing on the
              Platform constitutes investment advice, financial advice, or a recommendation to buy, sell, or hold any
              investment. CFF is not a registered investment advisor, broker-dealer, or financial planner.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">7.2 Data Accuracy</h3>
            <p className="text-muted-foreground leading-relaxed">
              While we strive to maintain accurate data, CFF does not guarantee the accuracy, completeness, or reliability
              of any information on the Platform, including survey data, analytics, directory listings, or AI-generated
              content. Data is provided by members and may contain errors or omissions.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">7.3 Platform Availability</h3>
            <p className="text-muted-foreground leading-relaxed">
              The Platform is provided on an "as is" and "as available" basis. We do not guarantee uninterrupted, error-free,
              or secure access. We may modify, suspend, or discontinue any feature or the entire Platform at any time
              without prior notice.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">7.4 AI Disclaimer</h3>
            <p className="text-muted-foreground leading-relaxed">
              PortIQ and other AI features use machine learning models that may produce inaccurate, incomplete, or biased
              results. AI-generated content should not be relied upon as the sole basis for any decision. You are
              responsible for independently verifying any information provided by AI features.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">7.5 Member Interactions</h3>
            <p className="text-muted-foreground leading-relaxed">
              CFF is not responsible for the conduct, representations, or business practices of any Member or user on the
              Platform. Any interactions, transactions, or partnerships formed through the Platform are solely between the
              parties involved.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by applicable law, CFF and its officers, directors, employees, and agents
              shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but
              not limited to loss of profits, data, business opportunities, or goodwill, arising out of or related to your
              use of or inability to use the Platform, even if we have been advised of the possibility of such damages.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Our total aggregate liability for any claims arising under these Terms shall not exceed the amount you have
              paid to CFF, if any, in the twelve (12) months preceding the claim.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">9. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify, defend, and hold harmless CFF and its affiliates, officers, directors, employees,
              and agents from and against any claims, liabilities, damages, losses, and expenses (including reasonable
              attorney's fees) arising out of or related to: (a) your use of the Platform; (b) your violation of these
              Terms; (c) your violation of any third-party rights; or (d) any content you submit to the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">10. Account Suspension & Termination</h2>
            <p className="text-muted-foreground leading-relaxed">
              CFF reserves the right to suspend or terminate your account at any time, with or without cause, including
              for violation of these Terms, inactivity, or at our sole discretion. Upon termination:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Your access to the Platform will be immediately revoked.</li>
              <li>Your profile will be removed from the network directory.</li>
              <li>You may request a copy of your data within 30 days of termination by contacting us.</li>
              <li>Survey responses you submitted may be retained in anonymized form for research purposes.</li>
              <li>Any team members associated with your company account will also lose access.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              You may delete your own account at any time through the Platform's settings or by contacting us.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">11. Feedback & Suggestions</h2>
            <p className="text-muted-foreground leading-relaxed">
              We welcome feedback and suggestions submitted through the Platform's feedback system. Any feedback you
              provide becomes the property of CFF, and we may use it to improve the Platform without obligation or
              compensation to you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">12. Third-Party Links & Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Platform may contain links to third-party websites, services, or content. CFF does not endorse, control,
              or assume responsibility for any third-party content or services. Your use of third-party services is governed
              by their respective terms and privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">13. Modifications to Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              CFF reserves the right to modify these Terms at any time. Material changes will be communicated via the
              Platform or email. Your continued use of the Platform after changes take effect constitutes acceptance of the
              revised Terms. If you do not agree to revised Terms, you must stop using the Platform and may request account
              deletion.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">14. Governing Law & Dispute Resolution</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms shall be governed by and construed in accordance with applicable international law. Any disputes
              arising from or relating to these Terms or the Platform shall first be resolved through good-faith negotiation.
              If negotiation fails, disputes shall be submitted to binding arbitration under internationally recognized
              arbitration rules. Each party shall bear its own costs unless otherwise determined by the arbitrator.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">15. Severability</h2>
            <p className="text-muted-foreground leading-relaxed">
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be limited or
              eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">16. Entire Agreement</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms, together with our{' '}
              <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, constitute the entire
              agreement between you and CFF regarding your use of the Platform and supersede all prior agreements,
              understandings, and communications.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">17. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              For questions about these Terms of Service, please contact us:
            </p>
            <div className="mt-4 p-6 bg-muted rounded-xl text-sm space-y-2">
              <p className="font-semibold text-foreground">Collaborative for Frontier Finance</p>
              <p className="text-muted-foreground">Email: <a href="mailto:hello@frontierfinance.org" className="text-primary hover:underline">hello@frontierfinance.org</a></p>
              <p className="text-muted-foreground">Website: <a href="https://frontierfinance.org" className="text-primary hover:underline">frontierfinance.org</a></p>
              <p className="text-muted-foreground">Technical Support: <a href="mailto:dev@frontierfinance.org" className="text-primary hover:underline">dev@frontierfinance.org</a></p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
