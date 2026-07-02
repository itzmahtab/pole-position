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

interface ReminderEmailProps {
  raceName: string;
  raceDate: string;
  circuit: string;
  country: string;
  reminderType: string;
  timezone: string;
}

export function ReminderEmail({
  raceName,
  raceDate,
  circuit,
  country,
  reminderType,
  timezone,
}: ReminderEmailProps) {
  const formattedType = reminderType.replace('h', ' hours').replace('m', ' minutes');

  return (
    <Html>
      <Head />
      <Preview>
        {raceName} starts in {formattedType}!
      </Preview>
      <Body style={{ backgroundColor: '#0a0a0f', color: '#f0f0f5', fontFamily: 'Inter, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Heading style={{ color: '#e10600', fontSize: '32px', marginBottom: '24px' }}>
            Pole Position
          </Heading>

          <Text style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '16px' }}>
            🏎️ {raceName}
          </Text>

          <Text style={{ fontSize: '18px', color: '#00d084', marginBottom: '24px' }}>
            Starts in {formattedType}!
          </Text>

          <div
            style={{
              backgroundColor: '#12121a',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '24px',
            }}
          >
            <Text style={{ margin: '0 0 8px' }}>
              <strong>Circuit:</strong> {circuit}
            </Text>
            <Text style={{ margin: '0 0 8px' }}>
              <strong>Location:</strong> {country}
            </Text>
            <Text style={{ margin: '0' }}>
              <strong>Your Time:</strong>{' '}
              {new Date(raceDate).toLocaleString('en-US', { timeZone: timezone })}
            </Text>
          </div>

          <Section style={{ textAlign: 'center' }}>
            <Button
              href={process.env.NEXT_PUBLIC_APP_URL}
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
              View Race Details
            </Button>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
