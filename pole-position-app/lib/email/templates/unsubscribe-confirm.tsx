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
} from "react-email";

export interface UnsubscribeConfirmEmailProps {
  email: string;
}

export function UnsubscribeConfirmEmail({ email }: UnsubscribeConfirmEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You&apos;ve been unsubscribed from race reminders.</Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>POLE POSITION</Text>
          </Section>
          <Heading style={h1}>You&apos;re off the grid</Heading>
          <Text style={p}>
            {email} has been unsubscribed from race reminders. You won&apos;t
            receive any more emails from us.
          </Text>
          <Text style={p}>We&apos;d love to have you back — the door&apos;s always open.</Text>
          <Hr style={hr} />
          <Text style={footer}>Lights out and away we go. — Pole Position</Text>
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

const hr = { borderColor: "rgba(255,255,255,0.08)", margin: "24px 0" };

const footer = { color: "#64748B", fontSize: "13px", margin: "0" };
