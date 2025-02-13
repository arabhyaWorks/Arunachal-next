import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface EmailTemplateProps {
  name?: string;
  email?: string;
  password?: string;
  loginUrl?: string;
}

export const WelcomeCreds = ({
  name,
  email,
  password,
  loginUrl,
}: EmailTemplateProps) => (
  <Html>
    <Head />
    <Preview>Your DIA Account Credentials</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
            src="https://indigenous.arunachal.gov.in/assets/images/logo_ap.png"
            width="100"
            height="100"
            alt="DIA Logo"
          />
        </Section>

        <Heading style={h1}>Welcome to DIA!</Heading>

        <Section style={credentialsBox}>
          <Text style={welcomeText}>Hello {name},</Text>
          <Text style={welcomeMessage}>
            Your account has been created successfully! 🎉
          </Text>
        </Section>

        <Text style={heroText}>
          Here are your account credentials to access the Department of
          Indigenous Affairs portal:
        </Text>

        <Section style={credentialsContainer}>
          <div style={credentialItem}>
            <Text style={credentialLabel}>Email:</Text>
            <Text style={credentialValue}>{email}</Text>
          </div>
          <div style={credentialItem}>
            <Text style={credentialLabel}>Password:</Text>
            <Text style={credentialValue}>{password}</Text>
          </div>
        </Section>

        <Section style={warningBox}>
          <Text style={warningText}>
            🔒 Please change your password after your first login for security
            purposes.
          </Text>
        </Section>

        <Section style={ctaContainer}>
          <Link href={loginUrl} target="_blank" style={ctaButton}>
            Login to Portal
          </Link>
        </Section>

        <Section style={divider} />

        <Section>
          <Text style={footerTitle}>Department of Indigenous Affairs</Text>
          <Text style={footerSubtitle}>Government of Arunachal Pradesh</Text>
        </Section>

        <Section>
          <Text style={footerText}>
            This is an automated message. Please do not reply to this email.
            <br />
            If you did not request this account, please contact us immediately.
          </Text>
        </Section>

        <Section>
          <Text style={footerCopyright}>
            ©2024 Department of Indigenous Affairs, Government of Arunachal
            Pradesh
            <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default WelcomeCreds;

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px",
  maxWidth: "600px",
};

const logoContainer = {
  display: "flex",
  justifyContent: "center",
  textAlign: "center" as const,
  marginTop: "20px",
  marginBottom: "20px",
};

const h1 = {
  color: "#165263",
  fontSize: "30px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  textAlign: "center" as const,
  lineHeight: "36px",
};

const credentialsBox = {
  background: "linear-gradient(135deg, #165263 0%, #0e7b90 100%)",
  borderRadius: "8px",
  padding: "30px",
  marginBottom: "30px",
  textAlign: "center" as const,
};

const welcomeText = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 10px 0",
};

const welcomeMessage = {
  color: "#ffffff",
  fontSize: "20px",
  margin: "0",
};

const heroText = {
  fontSize: "16px",
  lineHeight: "24px",
  marginBottom: "30px",
  color: "#0e7b90",
  textAlign: "center" as const,
};

const credentialsContainer = {
  backgroundColor: "#f8f9fa",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "30px",
};

const credentialItem = {
  marginBottom: "15px",
};

const credentialLabel = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#165263",
  marginBottom: "5px",
};

const credentialValue = {
  fontSize: "16px",
  color: "#0e7b90",
  padding: "10px",
  backgroundColor: "#ffffff",
  borderRadius: "4px",
  border: "1px solid #e5e5e5",
};

const warningBox = {
  backgroundColor: "#fff3cd",
  borderRadius: "8px",
  padding: "15px",
  marginBottom: "30px",
};

const warningText = {
  color: "#856404",
  fontSize: "14px",
  margin: "0",
  textAlign: "center" as const,
};

const ctaContainer = {
  textAlign: "center" as const,
  marginBottom: "30px",
};

const ctaButton = {
  backgroundColor: "#165263",
  borderRadius: "8px",
  color: "#ffffff",
  display: "inline-block",
  fontSize: "16px",
  fontWeight: "bold",
  padding: "12px 30px",
  textDecoration: "none",
  textTransform: "uppercase",
  transition: "background-color 0.3s ease",
};

const divider = {
  borderTop: "1px solid #e5e5e5",
  margin: "30px 0",
};

const footerTitle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#165263",
  textAlign: "center" as const,
  margin: "0",
};

const footerSubtitle = {
  fontSize: "16px",
  color: "#0e7b90",
  textAlign: "center" as const,
  marginTop: "5px",
};

const footerText = {
  fontSize: "14px",
  color: "#666666",
  lineHeight: "20px",
  textAlign: "center" as const,
  marginTop: "20px",
  marginBottom: "10px",
};

const footerCopyright = {
  fontSize: "12px",
  color: "#666666",
  lineHeight: "18px",
  textAlign: "center" as const,
  marginTop: "10px",
  marginBottom: "20px",
};
