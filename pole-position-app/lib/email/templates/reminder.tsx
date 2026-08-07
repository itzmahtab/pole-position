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

export interface ReminderEmailProps {
  email: string;
  sessionName: string;
  sessionType: string;
  circuitName: string;
  startsAtLabel: string;
  timezone: string;
  localTimeLabel: string;
  remainingLabel: string;
  driverName?: string | null;
  unsubscribeUrl: string;
}

export function ReminderEmail({
  email,
  sessionName,
  sessionType,
  circuitName,
  startsAtLabel,
  timezone,
  localTimeLabel,
  remainingLabel,
  driverName,
  unsubscribeUrl,
}: ReminderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>
        {sessionName} · {circuitName} starts in {remainingLabel}.
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Section style={header}>
            <Text style={brand}>POLE POSITION</Text>
            <Text style={badge}>
              {sessionType} · in {remainingLabel}
            </Text>
          </Section>
          <Heading style={h1}>{sessionName}</Heading>
          <Text style={p}>{circuitName}</Text>
          <Section style={meta}>
            <Text style={metaText}>
              <Text style={metaLabel}>Green light</Text> {startsAtLabel} ({localTimeLabel})
            </Text>
            {driverName ? (
              <Text style={metaText}>
                <Text style={metaLabel}>Your driver</Text> {driverName}
              </Text>
            ) : null}
          </Section>
          <Hr style={hr} />
          <Text style={footer}>
            Sent to {email} · timezone {timezone}.{" "}
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
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

const badge = {
  backgroundColor: "rgba(44,140,255,0.12)",
  borderRadius: "999px",
  color: "#2C8CFF",
  display: "inline-block",
  fontSize: "12px",
  fontWeight: 600,
  marginTop: "10px",
  padding: "4px 12px",
};

const h1 = { color: "#F8FAFC", fontSize: "24px", margin: "0 0 4px" };

const p = { color: "#94A3B8", fontSize: "15px", margin: "0 0 16px" };

const meta = { margin: "8px 0 0" };

const metaText = { color: "#E2E8F0", fontSize: "14px", margin: "0 0 8px" };

const metaLabel = {
  color: "#64748B",
  display: "inline",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "0.06em",
  marginRight: "8px",
  textTransform: "uppercase" as const,
};

const hr = { borderColor: "rgba(255,255,255,0.08)", margin: "24px 0" };

const footer = { color: "#64748B", fontSize: "12px", margin: "0" };

const link = {
  color: "#64748B",
  fontSize: "12px",
  textDecoration: "underline",
};
