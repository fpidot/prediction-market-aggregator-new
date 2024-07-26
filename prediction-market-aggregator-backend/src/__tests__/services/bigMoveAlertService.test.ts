process.env.NODE_ENV = 'test';

import { checkForBigMoves } from '../../services/bigMoveAlertService';
import Contract from '../../models/Contract';
import Subscriber from '../../models/Subscriber';
import { sendSMS } from '../../services/smsService';

jest.mock('../../models/Contract');
jest.mock('../../models/Subscriber');
jest.mock('../../services/smsService');

describe('bigMoveAlertService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send alerts for big moves', async () => {
    const mockContracts = [
      {
        name: 'Big Move Contract',
        currentPrice: 0.75,
        category: 'Politics',
        priceHistory: [{ price: 0.50, timestamp: new Date(Date.now() - 3600000) }]
      },
      {
        name: 'Small Move Contract',
        currentPrice: 0.52,
        category: 'Sports',
        priceHistory: [{ price: 0.50, timestamp: new Date(Date.now() - 3600000) }]
      }
    ];
    (Contract.find as jest.Mock).mockResolvedValue(mockContracts);

    const mockSubscribers = [
      { phoneNumber: '+1234567890', status: 'subscribed', categories: ['Politics'], alertTypes: ['bigMove'] },
      { phoneNumber: '+9876543210', status: 'subscribed', categories: ['Politics'], alertTypes: ['bigMove'] }
    ];
    (Subscriber.find as jest.Mock).mockResolvedValue(mockSubscribers);

    await checkForBigMoves();

    expect(sendSMS).toHaveBeenCalledTimes(2);
    expect(sendSMS).toHaveBeenCalledWith('+1234567890', expect.stringContaining('Big Move Contract has moved 50.00%'));
    expect(sendSMS).toHaveBeenCalledWith('+9876543210', expect.stringContaining('Big Move Contract has moved 50.00%'));
    expect(sendSMS).not.toHaveBeenCalledWith(expect.anything(), expect.stringContaining('Small Move Contract'));
  });
});