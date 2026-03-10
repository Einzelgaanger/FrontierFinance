import Footer from '@/components/layout/Footer';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">
      {/* Header */}
      <div className="bg-navy-900 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-slate-400 text-sm">Last updated: March 10, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        <div className="prose prose-slate max-w-none space-y-8">

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">1. Introduction</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Collaborative for Frontier Finance ("CFF," "we," "us," or "our") is committed to protecting the privacy
              and security of your personal information. This Privacy Policy describes how we collect, use, disclose, and
              safeguard your information when you use our platform at frontierfinance.org (the "Platform"), including our
              network directory, survey systems, analytics dashboards, PortIQ AI assistant, learning hub, community features,
              and all related services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              By accessing or using the Platform, you agree to the collection and use of information in accordance with this
              Privacy Policy. If you do not agree, please discontinue use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">2. Information We Collect</h2>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">2.1 Information You Provide</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Account Registration:</strong> Name, email address, password, organization/company name, role or job title, and profile picture.</li>
              <li><strong>Application Data:</strong> When applying for network membership, we collect your company name, investment thesis, team overview, team size, typical check size, number of investments, amount raised to date, location, organization website, expectations from the network, and supporting documents.</li>
              <li><strong>Survey Responses:</strong> Detailed fund and investment data submitted through our annual surveys (2021–2024 and future years), including fund size, geographic focus, sector focus, financial instruments, business stages, LP capital sources, SDG targets, gender lens data, portfolio performance metrics, employment impact data, and operational details.</li>
              <li><strong>Profile Information:</strong> Professional details including vehicle name, investment thesis, geographic focus, sector preferences, and other fields you choose to populate.</li>
              <li><strong>Community Content:</strong> Blog posts, comments, likes, learning resource interactions, and discussion contributions.</li>
              <li><strong>Communications:</strong> Messages sent through the platform's chat system, admin chat, feedback submissions, and correspondence with our team.</li>
              <li><strong>Company Member Data:</strong> If you are a company account holder, information about team members you invite, including their names, email addresses, and roles within your organization.</li>
              <li><strong>Launch Plus Assessments:</strong> Fund-specific data submitted through the Launch Plus program, including capital raised, geographical focus, legal status, and program expectations.</li>
            </ul>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">2.2 Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Usage Data:</strong> Pages visited, features used, actions taken, timestamps, and activity logs including points earned through platform engagement.</li>
              <li><strong>Device & Browser Information:</strong> IP address, browser type and version, operating system, device type, and user agent strings.</li>
              <li><strong>Authentication Data:</strong> Login timestamps, session information, and authentication tokens.</li>
              <li><strong>Analytics Data:</strong> Aggregated usage patterns, feature adoption metrics, and platform performance data.</li>
            </ul>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">2.3 Information from Third Parties</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may receive information from third-party authentication providers (such as Google) if you choose to sign in
              using those services, limited to your name, email address, and profile picture.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">3. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Platform Operations:</strong> To create and manage your account, process membership applications, and provide access to platform features based on your role (Admin, Member, or Viewer).</li>
              <li><strong>Network Directory:</strong> To maintain and display the fund manager directory, allowing network members to discover and connect with peers. Your profile visibility in the directory is controlled by the <code>show_in_directory</code> setting.</li>
              <li><strong>Survey & Analytics:</strong> To compile, analyze, and present aggregated survey data across multiple years, generate analytics dashboards, and produce research insights for the frontier finance ecosystem.</li>
              <li><strong>PortIQ AI Assistant:</strong> To power our AI-driven assistant that helps members explore survey data, generate insights, and answer questions about the network. Your queries and the AI's responses are stored for service improvement.</li>
              <li><strong>Communications:</strong> To send you platform notifications, survey invitations, newsletter updates, application status updates, and important service announcements via email (sent from hello@frontierfinance.org).</li>
              <li><strong>Security & Compliance:</strong> To verify identities, prevent fraud, enforce our terms, and comply with legal obligations.</li>
              <li><strong>Platform Improvement:</strong> To analyze usage patterns, improve features, fix bugs, and develop new functionality.</li>
              <li><strong>Company Team Management:</strong> To facilitate multi-user company accounts, allowing company administrators to invite and manage team members.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">4. Data Sharing & Disclosure</h2>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.1 Within the Network</h3>
            <p className="text-muted-foreground leading-relaxed">
              Members who opt into the network directory will have their profile information (company name, investment thesis,
              location, geographic and sector focus) visible to other authenticated network members. Survey responses are
              presented in aggregated, anonymized form in analytics dashboards unless you provide explicit consent for
              individual-level sharing. Field-level visibility is configurable by administrators.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.2 Service Providers</h3>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Supabase:</strong> Our infrastructure provider for database hosting, authentication, file storage, and serverless functions.</li>
              <li><strong>OpenAI:</strong> Powers our PortIQ AI assistant. Query content may be processed by OpenAI's API, subject to their data usage policies.</li>
              <li><strong>Resend:</strong> Email delivery service for transactional and notification emails.</li>
              <li><strong>Hosting Providers:</strong> For serving the platform's frontend application.</li>
            </ul>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.3 Legal Requirements</h3>
            <p className="text-muted-foreground leading-relaxed">
              We may disclose your information if required by law, regulation, legal process, or governmental request, or
              when we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.4 Business Transfers</h3>
            <p className="text-muted-foreground leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your personal information may be transferred as part
              of that transaction. We will notify you of any such change.
            </p>

            <h3 className="text-lg font-medium text-navy-800 mt-6 mb-3">4.5 No Sale of Personal Data</h3>
            <p className="text-muted-foreground leading-relaxed">
              We do not sell, rent, or trade your personal information to third parties for marketing purposes.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">5. Data Security</h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Encryption:</strong> All data in transit is encrypted using TLS/SSL. Data at rest is encrypted using industry-standard encryption.</li>
              <li><strong>Access Controls:</strong> Role-based access control (RBAC) ensures users only access data appropriate to their role. Row-Level Security (RLS) policies are enforced at the database level.</li>
              <li><strong>Authentication:</strong> Secure authentication via Supabase Auth with support for email/password and social sign-in. Password reset flows use secure, time-limited tokens.</li>
              <li><strong>Domain Restrictions:</strong> Our signup system prevents duplicate organizational accounts by checking email domains against existing registered companies.</li>
              <li><strong>Monitoring:</strong> Activity logging tracks user actions for security auditing. Member activity logs record actions within company accounts.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              While we implement robust security measures, no method of electronic transmission or storage is 100% secure.
              We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">6. Data Retention</h2>
            <p className="text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide you services.
              Survey responses are retained indefinitely to support longitudinal research and analytics across multiple years.
              If you request account deletion, we will remove your personal data within 30 days, except where retention is
              required by law or for legitimate research purposes (in which case data will be anonymized).
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Application data for rejected applicants is retained for the duration of any cooldown period, after which
              applicants may reapply.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">7. Your Rights</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Depending on your jurisdiction, you may have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate personal data through your profile settings or by contacting us.</li>
              <li><strong>Deletion:</strong> Request deletion of your account and associated personal data.</li>
              <li><strong>Portability:</strong> Request your data in a structured, machine-readable format.</li>
              <li><strong>Objection:</strong> Object to certain types of processing, including processing for direct marketing.</li>
              <li><strong>Restriction:</strong> Request restriction of processing in certain circumstances.</li>
              <li><strong>Withdraw Consent:</strong> Where processing is based on consent, you may withdraw it at any time.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              To exercise these rights, contact us at{' '}
              <a href="mailto:hello@frontierfinance.org" className="text-primary hover:underline">hello@frontierfinance.org</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">8. Cookies & Tracking</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Platform uses essential cookies and local storage for:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Authentication:</strong> Maintaining your login session and security tokens.</li>
              <li><strong>Preferences:</strong> Storing your UI preferences such as theme, sidebar state, and display settings.</li>
              <li><strong>Functionality:</strong> Enabling core platform features like survey progress saving and form state.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              We do not use third-party advertising or behavioral tracking cookies. Analytics are processed using our own
              infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">9. International Data Transfers</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Collaborative for Frontier Finance operates globally with members across emerging markets. Your data may
              be processed and stored in jurisdictions outside your country of residence, including the United States (where
              our infrastructure providers operate). We ensure appropriate safeguards are in place for international data
              transfers in compliance with applicable data protection laws, including GDPR and CCPA where applicable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">10. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              The Platform is designed for professional use by fund managers, investors, and financial professionals. We do
              not knowingly collect personal information from individuals under the age of 18. If we become aware that we have
              collected data from a minor, we will take steps to delete it promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">11. GDPR Compliance (EU Users)</h2>
            <p className="text-muted-foreground leading-relaxed">
              For users in the European Economic Area (EEA), we process personal data under the following legal bases:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li><strong>Contract Performance:</strong> Processing necessary to provide you with platform services.</li>
              <li><strong>Legitimate Interest:</strong> Analytics, security, and platform improvement.</li>
              <li><strong>Consent:</strong> Newsletter subscriptions and optional data sharing.</li>
              <li><strong>Legal Obligation:</strong> Compliance with applicable laws and regulations.</li>
            </ul>
            <p className="text-muted-foreground leading-relaxed mt-3">
              Our Data Protection contact can be reached at{' '}
              <a href="mailto:hello@frontierfinance.org" className="text-primary hover:underline">hello@frontierfinance.org</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">12. CCPA Compliance (California Users)</h2>
            <p className="text-muted-foreground leading-relaxed">
              California residents have additional rights under the California Consumer Privacy Act (CCPA), including the
              right to know what personal information is collected, the right to request deletion, and the right to opt out
              of the sale of personal information. As stated above, we do not sell personal information. To exercise your
              CCPA rights, contact us at{' '}
              <a href="mailto:hello@frontierfinance.org" className="text-primary hover:underline">hello@frontierfinance.org</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">13. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting the
              updated policy on the Platform and updating the "Last updated" date. Your continued use of the Platform after
              changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-navy-900 mb-4">14. Contact Us</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please
              contact us:
            </p>
            <div className="mt-4 p-6 bg-muted rounded-xl text-sm space-y-2">
              <p className="font-semibold text-foreground">Collaborative for Frontier Finance</p>
              <p className="text-muted-foreground">Email: <a href="mailto:hello@frontierfinance.org" className="text-primary hover:underline">hello@frontierfinance.org</a></p>
              <p className="text-muted-foreground">Website: <a href="https://frontierfinance.org" className="text-primary hover:underline">frontierfinance.org</a></p>
              <p className="text-muted-foreground">For technical/data issues: <a href="mailto:developer@frontierfinance.org" className="text-primary hover:underline">developer@frontierfinance.org</a></p>
            </div>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
