import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client: twilio.Twilio | null = null;

if (process.env.NODE_ENV !== 'test') {
  console.log('Initializing Twilio client with:');
  console.log('TWILIO_ACCOUNT_SID:', accountSid);
  console.log('TWILIO_AUTH_TOKEN:', authToken ? 'Set' : 'Not set');
  console.log('TWILIO_PHONE_NUMBER:', twilioPhoneNumber);

  if (!accountSid || !authToken || !twilioPhoneNumber) {
    console.error('Twilio credentials are missing. Please check your .env file.');
    process.exit(1);
  }

  try {
    client = twilio(accountSid, authToken);
    console.log('Twilio client initialized successfully');
  } catch (error) {
    console.error('Error initializing Twilio client:', error);
    process.exit(1);
  }
}

export const sendSMS = async (phoneNumber: string, message: string) => {
  if (process.env.NODE_ENV === 'test') {
    console.log(`Mock SMS sent to ${phoneNumber}: ${message}`);
    return { sid: 'MOCK_SID' };
  }

  if (!client) {
    console.error('Twilio client not initialized');
    return;
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: phoneNumber
    });
    console.log(`Message sent successfully. SID: ${result.sid}`);
    return result;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};