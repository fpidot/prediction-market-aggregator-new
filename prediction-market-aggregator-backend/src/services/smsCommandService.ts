import { Subscriber, ISubscriber } from '../models/Subscriber';

type SubscriptionStatus = 'subscribed' | 'unsubscribed' | 'stopped' | 'paused';

export const handleSmsCommand = async (phone: string, command: string): Promise<string> => {
  const lowercaseCommand = command.toLowerCase();

  if (lowercaseCommand === 'stop') {
    await Subscriber.findOneAndUpdate({ phone }, { status: 'stopped' as SubscriptionStatus });
    return 'You have been unsubscribed from all messages.';
  }

  if (lowercaseCommand === 'pause') {
    await Subscriber.findOneAndUpdate({ phone }, { status: 'paused' as SubscriptionStatus });
    return 'Your subscription has been paused. Send RESUME to resume receiving messages.';
  }

  if (lowercaseCommand === 'resume') {
    await Subscriber.findOneAndUpdate({ phone }, { status: 'subscribed' as SubscriptionStatus });
    return 'Your notifications have been resumed.';
  }

  // Default case for unrecognized commands
  return 'Invalid command. Available commands: STOP, PAUSE, RESUME';
};