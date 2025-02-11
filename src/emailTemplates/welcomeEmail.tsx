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
  
  interface DIAWelcomeEmailProps {
    userName?: string;
  }
  
  export const WelcomeEmail = ({ userName = "there" }: DIAWelcomeEmailProps) => (
    <Html>
      <Head />
      <Preview>Welcome to Department of Indigenous Affairs</Preview>
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
          
          <Section style={welcomeBox}>
            <Text style={welcomeText}>
              Hi {userName},
            </Text>
            <Text style={welcomeMessage}>
              Your registration was successful! 🎉
            </Text>
          </Section>
  
          <Text style={heroText}>
            Thank you for joining the Department of Indigenous Affairs portal. We're excited
            to have you as part of our community dedicated to preserving and promoting
            the rich cultural heritage of Arunachal Pradesh.
          </Text>
  
          <Section style={featuresContainer}>
            <Text style={featuresTitle}>What you can do now:</Text>
            <ul style={featuresList}>
              <li style={featureItem}>
                <span style={featureIcon}>📚</span>
                Explore our vast collection of cultural content
              </li>
              <li style={featureItem}>
                <span style={featureIcon}>🎵</span>
                Access traditional music and dance performances
              </li>
              <li style={featureItem}>
                <span style={featureIcon}>📅</span>
                Stay updated with upcoming festivals and events
              </li>
              <li style={featureItem}>
                <span style={featureIcon}>🤝</span>
                Connect with community members
              </li>
            </ul>
          </Section>
  
          <Section style={ctaContainer}>
            <Link
              href="https://indigenous.arunachal.gov.in/dashboard"
              target="_blank"
              style={ctaButton}
            >
              Visit Your Dashboard
            </Link>
          </Section>
  
          <Section style={divider} />
  
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
              ©2024 Department of Indigenous Affairs, Government of Arunachal Pradesh
              <br />
              All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  export default WelcomeEmail;
  
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
  
  const welcomeBox = {
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
  
  const featuresContainer = {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "20px",
    marginBottom: "30px",
  };
  
  const featuresTitle = {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#165263",
    marginBottom: "15px",
  };
  
  const featuresList = {
    listStyleType: "none",
    padding: "0",
    margin: "0",
  };
  
  const featureItem = {
    display: "flex",
    alignItems: "center",
    fontSize: "16px",
    color: "#0e7b90",
    marginBottom: "12px",
    lineHeight: "24px",
  };
  
  const featureIcon = {
    marginRight: "10px",
    fontSize: "20px",
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