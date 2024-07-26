import { Subscriber, ISubscriber } from '../models/Subscriber';

export async function handleSmsCommand(body: string, from: string): Promise<string> {
  const command = body.trim().toUpperCase();
  const subscriber = await Subscriber.findOne({ phoneNumber: from });

  if (!subscriber) {
    return 'You are not subscribed to our service.';
  }

  switch (command) {
    case 'STOP':
      subscriber.status = 'stopped';
      await subscriber.save();
      return 'You have been unsubscribed from all notifications.';
    case 'PAUSE':
      subscriber.status = 'paused';
      await subscriber.save();
      return 'Your notifications have been paused.';
    case 'RESUME':
      subscriber.status = 'subscribed';
      await subscriber.save();
      return 'Your notifications have been resumed.';
    default:
      return 'Invalid command. Available commands: STOP, PAUSE, RESUME';
  }
}