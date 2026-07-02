import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
} from '@react-email/components';

interface WelcomeEmailProps {
  email: string;
  verificationToken: string;
  preferences: {
    reminder_24h: boolean;
    reminder_12h: boolean;
    reminder_1h: boolean;
    reminder_15m: boolean;
  };
}

export function WelcomeEmail({ email, verificationToken, preferences }: WelcomeEmailProps) {
  const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify?token=${verificationToken}`;

  return (
    <Html>
      <Head />
      <Preview>Welcome to Pole Position — Your F1 companion is ready!</Preview>
      <Body style={{ backgroundColor: '#0a0a0f', color: '#f0f0f5', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Heading style={{ color: '#e10600', fontSize: '32px', marginBottom: '24px' }}>
            Pole Position
          </Heading>

          <Text style={{ fontSize: '18px', marginBottom: '16px' }}>
            Welcome to the ultimate Formula One companion!
          </Text>

          <Text style={{ color: '#8a8a9a', lineHeight: '1.6' }}>
            You&apos;ve successfully subscribed to race reminders. We&apos;ll keep you updated
            with:
          </Text>

          <ul style={{ color: '#8a8a9a', lineHeight: '1.8', paddingLeft: '20px' }}>
            {preferences.reminder_24h && <li>24-hour race reminders</li>}
            {preferences.reminder_12h && <li>12-hour race reminders</li>}
            {preferences.reminder_1h && <li>1-hour race reminders</li>}
            {preferences.reminder_15m && <li>15-minute race reminders</li>}
          </ul>

          <Section style={{ textAlign: 'center', margin: '32px 0' }}>
            <Button
              href={verifyUrl}
              style={{
                backgroundColor: '#e10600',
                color: '#ffffff',
                padding: '14px 32px',
                borderRadius: '12px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '600',
              }}
            >
              Confirm Your Email
            </Button>
          </Section>

          <Text style={{ color: '#8a8a9a', fontSize: '12px', textAlign: 'center' }}>
            If you didn&apos;t subscribe to Pole Position, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
