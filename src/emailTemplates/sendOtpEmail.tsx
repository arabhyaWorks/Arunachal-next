import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface DIAEmailProps {
  validationCode?: string;
}

export const SendOtpEmail = ({ validationCode }: DIAEmailProps) => (
  <Html>
    <Head />
    <Preview>Verify your email - Department of Indigenous Affairs</Preview>
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
        <Heading style={h1}>Verify your email address</Heading>
        <Text style={heroText}>
          Welcome to the Department of Indigenous Affairs portal. To complete
          your registration, please enter the verification code below in your
          browser window.
        </Text>

        <Section style={codeBox}>
          <Text style={confirmationCodeText}>{validationCode}</Text>
        </Section>

        <Text style={text}>
          This code will expire in 10 minutes. If you didn't request this
          verification, please ignore this email.
        </Text>

        <Section style={divider}></Section>

        <Section>
          <Text style={footerTitle}>Department of Indigenous Affairs</Text>
          <Text style={footerSubtitle}>Government of Arunachal Pradesh</Text>
        </Section>

        <Section>
          <Row style={footerLogos}>
            <Column style={{ width: "100%", textAlign: "center" as const }}>
              <Text style={footerText}>Connect with us</Text>
              <Row style={socialLinks}>
                <Column>
                  <Link href="https://facebook.com" style={socialLink}>
                    Facebook
                  </Link>
                </Column>
                <Column>
                  <Link href="https://twitter.com" style={socialLink}>
                    Twitter
                  </Link>
                </Column>
                <Column>
                  <Link href="https://instagram.com" style={socialLink}>
                    Instagram
                  </Link>
                </Column>
              </Row>
            </Column>
          </Row>
        </Section>

        <Section>
          <Link
            style={footerLink}
            href="https://indigenous.arunachal.gov.in/about"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Us
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://indigenous.arunachal.gov.in/privacy"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://indigenous.arunachal.gov.in/contact"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact Us
          </Link>
          <Text style={footerText}>
            ©2024 Department of Indigenous Affairs, Government of Arunachal
            Pradesh <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);


export default SendOtpEmail;

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

const heroText = {
  fontSize: "18px",
  lineHeight: "26px",
  marginBottom: "30px",
  color: "#0e7b90",
  textAlign: "center" as const,
};

const codeBox = {
  background: "linear-gradient(to right, #165263, #0e7b90)",
  borderRadius: "8px",
  marginBottom: "30px",
  padding: "30px",
};

const confirmationCodeText = {
  fontSize: "36px",
  fontWeight: "bold",
  textAlign: "center" as const,
  verticalAlign: "middle",
  color: "#ffffff",
  letterSpacing: "8px",
};

const text = {
  color: "#666666",
  fontSize: "14px",
  lineHeight: "24px",
  textAlign: "center" as const,
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

const footerLogos = {
  marginTop: "20px",
  marginBottom: "20px",
  width: "100%",
};

const socialLinks = {
  display: "flex",
  justifyContent: "center",
  gap: "20px",
  marginTop: "10px",
};

const socialLink = {
  color: "#0e7b90",
  textDecoration: "none",
  fontSize: "14px",
};

const footerLink = {
  color: "#0e7b90",
  textDecoration: "none",
  fontSize: "14px",
};

const footerText = {
  fontSize: "12px",
  color: "#666666",
  lineHeight: "18px",
  textAlign: "center" as const,
  marginTop: "20px",
  marginBottom: "20px",
};
