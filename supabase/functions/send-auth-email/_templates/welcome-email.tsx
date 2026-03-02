import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from 'https://esm.sh/@react-email/components@0.0.22'
import * as React from 'https://esm.sh/react@18.3.1'

interface WelcomeEmailProps {
  email: string
  companyName: string
  confirmLink: string
}

export const WelcomeEmail = ({ email, companyName, confirmLink }: WelcomeEmailProps) => (
  <Html>
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>Welcome to Collaborative For Frontier Finance — confirm your email to join 200+ fund managers across Africa &amp; the Middle East.</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Navy header with logo */}
        <Section style={headerSection}>
          <Img
            src="https://escpnetwork.net/CFF%20LOGO.png"
            width="160"
            height="64"
            alt="Collaborative For Frontier Finance"
            style={logo}
          />
        </Section>

        {/* Gold accent bar */}
        <Section style={accentBar} />

        {/* Welcome banner */}
        <Section style={welcomeBanner}>
          <Text style={welcomeEmoji}>🎉</Text>
          <Heading style={h1}>Welcome to the Network</Heading>
          <Text style={welcomeSub}>You're one step away from joining the community</Text>
        </Section>

        {/* Main content */}
        <Section style={contentSection}>
          <Text style={greeting}>
            Hello {companyName},
          </Text>
          <Text style={text}>
            Thank you for joining the Collaborative for Frontier Finance (CFF) Network — 
            a global community of fund managers and emerging market professionals advancing 
            MSME financing across Africa and the Middle East.
          </Text>
          <Text style={text}>
            To activate your account, please confirm your email address:
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Link href={confirmLink} target="_blank" style={button}>
              Confirm My Account
            </Link>
          </Section>

          <Text style={smallText}>
            This link expires in 24 hours for security purposes.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* What's next section */}
        <Section style={contentSection}>
          <Heading as="h2" style={h2}>What You Can Do</Heading>
          <table style={featureTable}>
            <tbody>
              <tr>
                <td style={featureIconTd}>
                  <Section style={featureIconBox}>
                    <Text style={featureIconText}>📊</Text>
                  </Section>
                </td>
                <td style={featureContent}>
                  <Text style={featureTitle}>Complete Surveys</Text>
                  <Text style={featureDesc}>Contribute to annual MSME financing surveys and shape industry insights</Text>
                </td>
              </tr>
              <tr>
                <td style={featureIconTd}>
                  <Section style={featureIconBox}>
                    <Text style={featureIconText}>📈</Text>
                  </Section>
                </td>
                <td style={featureContent}>
                  <Text style={featureTitle}>View Analytics</Text>
                  <Text style={featureDesc}>Explore data-driven insights and market trends across the network</Text>
                </td>
              </tr>
              <tr>
                <td style={featureIconTd}>
                  <Section style={featureIconBox}>
                    <Text style={featureIconText}>🌐</Text>
                  </Section>
                </td>
                <td style={featureContent}>
                  <Text style={featureTitle}>Network Directory</Text>
                  <Text style={featureDesc}>Connect with 200+ fund managers across 25+ countries</Text>
                </td>
              </tr>
              <tr>
                <td style={featureIconTd}>
                  <Section style={featureIconBox}>
                    <Text style={featureIconText}>📚</Text>
                  </Section>
                </td>
                <td style={featureContent}>
                  <Text style={featureTitle}>Learning Hub</Text>
                  <Text style={featureDesc}>Access curated resources, webinars, and industry knowledge</Text>
                </td>
              </tr>
            </tbody>
          </table>
        </Section>

        <Hr style={divider} />

        {/* Fallback link */}
        <Section style={contentSection}>
          <Text style={fallbackText}>
            If the button above doesn't work, copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>{confirmLink}</Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Text style={footerIgnore}>
            If you didn't create this account, you can safely ignore this email.
          </Text>
          <Hr style={footerDivider} />
          <Img
            src="https://escpnetwork.net/CFF%20LOGO.png"
            width="100"
            height="40"
            alt="Collaborative For Frontier Finance"
            style={{ margin: '0 auto 12px', display: 'block', opacity: 0.6 }}
          />
          <Text style={footerBrand}>
            Collaborative for Frontier Finance
          </Text>
          <Text style={footerSubtext}>
            Advancing MSME financing in Africa and the Middle East
          </Text>
          <Hr style={footerDivider} />
          <Text style={copyright}>
            © {new Date().getFullYear()} Collaborative For Frontier Finance. All rights reserved.
          </Text>
          <Link href="https://frontierfinance.org" style={footerLink}>frontierfinance.org</Link>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// ── Styles ──────────────────────────────────────────

const navy = '#0f1d2e'
const gold = '#c49a2b'
const textDark = '#1a1a2e'
const textMuted = '#5a5a6e'
const borderColor = '#e8e8ee'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
}

const container = {
  margin: '0 auto',
  maxWidth: '600px',
  backgroundColor: '#ffffff',
  border: '1px solid #e5e7eb',
  borderRadius: '12px',
  overflow: 'hidden' as const,
}

const headerSection = {
  backgroundColor: navy,
  padding: '36px 40px 28px',
  textAlign: 'center' as const,
}

const logo = {
  margin: '0 auto',
  display: 'block',
}

const accentBar = {
  backgroundColor: gold,
  height: '4px',
}

const welcomeBanner = {
  backgroundColor: '#fefce8',
  padding: '28px 40px 20px',
  textAlign: 'center' as const,
}

const welcomeEmoji = {
  fontSize: '40px',
  margin: '0 0 4px',
  lineHeight: '1',
}

const welcomeSub = {
  color: textMuted,
  fontSize: '14px',
  margin: '4px 0 0',
}

const contentSection = {
  padding: '32px 40px',
}

const h1 = {
  color: navy,
  fontSize: '28px',
  fontWeight: '700',
  margin: '8px 0 0',
  padding: '0',
  lineHeight: '1.3',
}

const h2 = {
  color: navy,
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px',
  padding: '0',
}

const greeting = {
  color: textDark,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 4px',
  fontWeight: '600',
}

const text = {
  color: textDark,
  fontSize: '15px',
  lineHeight: '26px',
  margin: '12px 0',
}

const smallText = {
  color: textMuted,
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '16px 0 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '28px 0 8px',
}

const button = {
  backgroundColor: gold,
  borderRadius: '8px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '16px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '16px 40px',
  letterSpacing: '0.3px',
  boxShadow: '0 2px 8px rgba(196, 154, 43, 0.3)',
}

const divider = {
  borderColor: borderColor,
  margin: '0',
}

const featureTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const featureIconTd = {
  width: '48px',
  paddingBottom: '20px',
  verticalAlign: 'top' as const,
}

const featureIconBox = {
  backgroundColor: '#fefce8',
  borderRadius: '10px',
  width: '40px',
  height: '40px',
  textAlign: 'center' as const,
  lineHeight: '40px',
}

const featureIconText = {
  fontSize: '20px',
  margin: '0',
  lineHeight: '40px',
}

const featureContent = {
  paddingBottom: '20px',
  paddingLeft: '12px',
  verticalAlign: 'top' as const,
}

const featureTitle = {
  color: textDark,
  fontSize: '14px',
  fontWeight: '600',
  margin: '0 0 2px',
}

const featureDesc = {
  color: textMuted,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
}

const fallbackText = {
  color: textMuted,
  fontSize: '13px',
  margin: '0 0 8px',
}

const linkText = {
  color: gold,
  fontSize: '12px',
  wordBreak: 'break-all' as const,
  margin: '0',
}

const footerSection = {
  backgroundColor: '#f8f9fa',
  padding: '28px 40px',
  textAlign: 'center' as const,
}

const footerIgnore = {
  color: textMuted,
  fontSize: '13px',
  margin: '0 0 16px',
}

const footerDivider = {
  borderColor: borderColor,
  margin: '0 0 16px',
}

const footerBrand = {
  color: navy,
  fontSize: '14px',
  fontWeight: '700',
  margin: '0 0 4px',
}

const footerSubtext = {
  color: textMuted,
  fontSize: '12px',
  margin: '0 0 12px',
}

const copyright = {
  color: '#999',
  fontSize: '11px',
  margin: '0 0 4px',
}

const footerLink = {
  color: gold,
  textDecoration: 'none',
  fontSize: '11px',
}
