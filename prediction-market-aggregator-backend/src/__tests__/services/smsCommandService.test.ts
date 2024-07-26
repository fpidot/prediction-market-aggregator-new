import { handleSmsCommand } from '../../services/smsCommandService';
import { Subscriber } from '../../models/Subscriber';

jest.mock('../../models/Subscriber');

describe('smsCommandService', () => {
  let mockSubscriber: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockSubscriber = {
      status: 'subscribed',
      save: jest.fn(),
    };
    (Subscriber.findOne as jest.Mock).mockResolvedValue(mockSubscriber);
  });

  it('should return "You are not subscribed" for unknown number', async () => {
    (Subscriber.findOne as jest.Mock).mockResolvedValue(null);
    const result = await handleSmsCommand('STOP', '+1234567890');
    expect(result).toBe('You are not subscribed to our service.');
  });

  it('should handle STOP command', async () => {
    const result = await handleSmsCommand('STOP', '+1234567890');
    expect(result).toBe('You have been unsubscribed from all notifications.');
    expect(mockSubscriber.status).toBe('stopped');
    expect(mockSubscriber.save).toHaveBeenCalled();
  });

  it('should handle PAUSE command', async () => {
    const result = await handleSmsCommand('PAUSE', '+1234567890');
    expect(result).toBe('Your notifications have been paused.');
    expect(mockSubscriber.status).toBe('paused');
    expect(mockSubscriber.save).toHaveBeenCalled();
  });

  it('should handle RESUME command', async () => {
    mockSubscriber.status = 'paused';
    const result = await handleSmsCommand('RESUME', '+1234567890');
    expect(result).toBe('Your notifications have been resumed.');
    expect(mockSubscriber.status).toBe('subscribed');
    expect(mockSubscriber.save).toHaveBeenCalled();
  });

  it('should handle invalid commands', async () => {
    const result = await handleSmsCommand('INVALID', '+1234567890');
    expect(result).toBe('Invalid command. Available commands: STOP, PAUSE, RESUME');
    expect(mockSubscriber.save).not.toHaveBeenCalled();
  });
});