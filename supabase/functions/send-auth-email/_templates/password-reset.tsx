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

interface PasswordResetEmailProps {
  resetLink: string
}

export const PasswordResetEmail = ({ resetLink }: PasswordResetEmailProps) => (
  <Html>
    <Head>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
      `}</style>
    </Head>
    <Preview>Reset your Collaborative For Frontier Finance password — click the secure link inside to set a new one.</Preview>
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

        {/* Main content */}
        <Section style={contentSection}>
          <Section style={iconCircle}>
            <Text style={iconText}>🔐</Text>
          </Section>
          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>
            We received a request to reset the password for your Collaborative For Frontier Finance account. 
            Click the button below to create a new, secure password:
          </Text>

          {/* CTA Button */}
          <Section style={buttonContainer}>
            <Link href={resetLink} target="_blank" style={button}>
              Reset My Password
            </Link>
          </Section>

          <Text style={smallText}>
            This link expires in 1 hour for security purposes.
          </Text>
        </Section>

        <Hr style={divider} />

        {/* Security notice */}
        <Section style={noticeSection}>
          <Text style={noticeText}>
            If you did not request this password reset, no action is needed and your password remains unchanged.
          </Text>
          <Link href="mailto:info@frontierfinance.org" style={noticeLink}>info@frontierfinance.org</Link>
        </Section>

        <Hr style={divider} />

        {/* Fallback link */}
        <Section style={contentSection}>
          <Text style={fallbackText}>
            If the button above doesn't work, copy and paste this link into your browser:
          </Text>
          <Text style={linkText}>{resetLink}</Text>
        </Section>

        {/* Footer */}
        <Section style={footerSection}>
          <Img
            src="https://escpnetwork.net/CFF%20LOGO.png"
            width="100"
            height="40"
            alt="Collaborative For Frontier Finance"
            style={{ margin: '0 auto 12px', display: 'block', opacity: 0.6 }}
          />
          <Text style={footerBrand}>
            Collaborative For Frontier Finance
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

export default PasswordResetEmail

// ── Styles ──────────────────────────────────────────

const navy = '#0f1d2e'
const gold = '#c49a2b'
const textDark = '#1a1a2e'
const textMuted = '#5a5a6e'
const borderColor = '#e8e8ee'

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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

const contentSection = {
  padding: '32px 40px',
}

const iconCircle = {
  textAlign: 'center' as const,
  marginBottom: '8px',
}

const iconText = {
  fontSize: '36px',
  margin: '0',
  lineHeight: '1',
}

const h1 = {
  color: navy,
  fontSize: '26px',
  fontWeight: '700',
  margin: '0 0 16px',
  padding: '0',
  textAlign: 'center' as const,
  lineHeight: '1.3',
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

const noticeSection = {
  padding: '24px 40px',
  backgroundColor: '#fefce8',
  borderLeft: `4px solid ${gold}`,
}

const noticeText = {
  color: '#78350f',
  fontSize: '13px',
  lineHeight: '22px',
  margin: '0',
}

const noticeLink = {
  color: gold,
  textDecoration: 'underline',
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

const footerDivider = {
  borderColor: borderColor,
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
