import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSMS(to: string, body: string) {
  try {
    const message = await client.messages.create({
      body: body,
      from: twilioPhoneNumber,
      to: to
    });
    console.log('SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
}

export async function sendDailyUpdate(to: string, body: string) {
  try {
    const message = await sendSMS(to, body);
    console.log('Daily update SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending daily update SMS:', error);
    throw error;
  }
}

export async function sendBigMoveAlert(to: string, body: string) {
  try {
    const message = await sendSMS(to, body);
    console.log('Big move alert SMS sent successfully:', message.sid);
    return message;
  } catch (error) {
    console.error('Error sending big move alert SMS:', error);
    throw error;
  }
}