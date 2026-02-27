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
    <Head />
    <Preview>Welcome to CFF Network – Confirm your email to get started</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with logo */}
        <Section style={headerSection}>
          <Img
            src="https://escpnetwork.net/CFF%20LOGO.png"
            width="140"
            height="56"
            alt="CFF Network"
            style={logo}
          />
        </Section>

        {/* Gold accent bar */}
        <Section style={accentBar} />

        {/* Main content */}
        <Section style={contentSection}>
          <Heading style={h1}>Welcome to the Network</Heading>
          <Text style={subtitle}>
            Hello {companyName},
          </Text>
          <Text style={text}>
            Thank you for joining the Collaborative for Frontier Finance (CFF) Network — 
            a global community of fund managers and emerging market professionals advancing 
            MSME financing across Africa and the Middle East.
          </Text>
          <Text style={text}>
            To activate your account and get started, please confirm your email address:
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
                <td style={featureIcon}>📊</td>
                <td style={featureContent}>
                  <strong style={featureTitle}>Complete Surveys</strong><br />
                  <span style={featureDesc}>Access annual MSME financing surveys</span>
                </td>
              </tr>
              <tr>
                <td style={featureIcon}>📈</td>
                <td style={featureContent}>
                  <strong style={featureTitle}>View Analytics</strong><br />
                  <span style={featureDesc}>Explore data insights and market trends</span>
                </td>
              </tr>
              <tr>
                <td style={featureIcon}>🌐</td>
                <td style={featureContent}>
                  <strong style={featureTitle}>Network Directory</strong><br />
                  <span style={featureDesc}>Connect with 200+ fund managers across 25+ countries</span>
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
          <Text style={footerText}>
            If you didn't create this account, you can safely ignore this email.
          </Text>
          <Hr style={footerDivider} />
          <Text style={footerBrand}>
            Collaborative for Frontier Finance
          </Text>
          <Text style={footerSubtext}>
            Advancing MSME financing in Africa and the Middle East
          </Text>
          <Text style={copyright}>
            © {new Date().getFullYear()} CFF Network. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

// ── Styles ──────────────────────────────────────────

const navy = '#0f1d2e'
const gold = '#c49a2b'
const goldLight = '#f5ecd5'
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
}

const headerSection = {
  backgroundColor: navy,
  padding: '32px 40px 24px',
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

const contentSection = {
  padding: '32px 40px',
}

const h1 = {
  color: navy,
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 8px',
  padding: '0',
  lineHeight: '1.3',
}

const h2 = {
  color: navy,
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 16px',
  padding: '0',
}

const subtitle = {
  color: textDark,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '12px 0 0',
}

const text = {
  color: textDark,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '12px 0',
}

const smallText = {
  color: textMuted,
  fontSize: '13px',
  textAlign: 'center' as const,
  margin: '12px 0 0',
}

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '28px 0 8px',
}

const button = {
  backgroundColor: gold,
  borderRadius: '6px',
  color: navy,
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: '700',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '14px 36px',
  letterSpacing: '0.3px',
}

const divider = {
  borderColor: borderColor,
  margin: '0',
}

const featureTable = {
  width: '100%',
  borderCollapse: 'collapse' as const,
}

const featureIcon = {
  width: '40px',
  fontSize: '20px',
  paddingBottom: '16px',
  verticalAlign: 'top' as const,
}

const featureContent = {
  paddingBottom: '16px',
  paddingLeft: '8px',
  verticalAlign: 'top' as const,
}

const featureTitle = {
  color: textDark,
  fontSize: '14px',
}

const featureDesc = {
  color: textMuted,
  fontSize: '13px',
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
  backgroundColor: '#f8f8fa',
  padding: '24px 40px',
  textAlign: 'center' as const,
}

const footerText = {
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
  margin: '0 0 8px',
}

const copyright = {
  color: '#999',
  fontSize: '11px',
  margin: '0',
}
