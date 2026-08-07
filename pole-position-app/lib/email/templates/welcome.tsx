import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Link,
} from "react-email";

export interface WelcomeEmailProps {
  email: string;
  reminderWindows: string[];
  unsubscribeUrl: string;
}

export function WelcomeEmail({
  email,
  reminderWindows,
  unsubscribeUrl,
}: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;re on the grid — race reminders are live.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>POLE POSITION</Text>
          </Section>
          <Heading style={h1}>Welcome to the grid</Heading>
          <Text style={p}>
            Confirmed for <Text style={strong}>{email}</Text>. You&apos;ll get an
            email before each F1 session at your chosen reminders:
          </Text>
          <Text style={windows}>{reminderWindows.join("  ·  ")}</Text>
          <Text style={p}>
            No spam, just race day signals. You can change your reminders or opt
            out whenever you like.
          </Text>
          <Hr style={hr} />
          <Text style={footer}>
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe from race reminders
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#05070A",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  margin: 0,
  padding: "32px 0",
};

const container = {
  backgroundColor: "#0A0D12",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "12px",
  margin: "0 auto",
  maxWidth: "520px",
  padding: "32px",
};

const header = { marginBottom: "20px" };

const brand = {
  color: "#E50914",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.18em",
};

const h1 = { color: "#F8FAFC", fontSize: "22px", margin: "0 0 12px" };

const p = {
  color: "#94A3B8",
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "0 0 10px",
};

const strong = { color: "#F8FAFC", fontWeight: 600 };

const windows = {
  color: "#2C8CFF",
  fontSize: "14px",
  fontWeight: 600,
  margin: "4px 0 16px",
};

const hr = { borderColor: "rgba(255,255,255,0.08)", margin: "24px 0" };

const footer = { margin: "0" };

const link = {
  color: "#64748B",
  fontSize: "13px",
  textDecoration: "none",
};
