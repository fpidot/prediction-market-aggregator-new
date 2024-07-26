import twilio from 'twilio';
import SMS from '../models/SMS';
import Subscriber from '../models/Subscriber';
import logger from '../utils/logger';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export const sendSMS = async (to: string, body: string): Promise<void> => {
  try {
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to,
    });
    
    // Save the sent SMS to the database
    const newSMS = new SMS({
      to,
      body,
      createdAt: new Date(),
      twilioMessageId: message.sid
    });
    await newSMS.save();

    // Update subscriber's lastAlertSent
    await Subscriber.findOneAndUpdate(
      { phoneNumber: to },
      { 
        $set: { 
          lastAlertSent: new Date(),
          status: 'subscribed'  // Assuming sending an SMS means they're subscribed
        }
      },
      { upsert: true, new: true }
    );

    logger.info(`SMS sent to ${to}`);
  } catch (error) {
    logger.error('Error sending SMS:', error);
    throw error;
  }
};