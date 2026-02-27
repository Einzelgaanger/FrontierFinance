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
    <Head />
    <Preview>Reset your CFF Network password</Preview>
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
          <Section style={iconContainer}>
            <Text style={iconCircle}>🔒</Text>
          </Section>

          <Heading style={h1}>Reset Your Password</Heading>
          <Text style={text}>
            We received a request to reset the password for your CFF Network account. 
            Click the button below to choose a new password:
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
            <strong>Didn't request this?</strong> No action is needed — your password 
            will remain unchanged. If you're concerned about your account security, 
            please contact our support team.
          </Text>
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

export default PasswordResetEmail

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

const iconContainer = {
  textAlign: 'center' as const,
  marginBottom: '8px',
}

const iconCircle = {
  fontSize: '36px',
  margin: '0',
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

const noticeSection = {
  padding: '24px 40px',
  backgroundColor: '#fef9ee',
}

const noticeText = {
  color: '#7a6520',
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
  backgroundColor: '#f8f8fa',
  padding: '24px 40px',
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
  margin: '0 0 8px',
}

const copyright = {
  color: '#999',
  fontSize: '11px',
  margin: '0',
}
