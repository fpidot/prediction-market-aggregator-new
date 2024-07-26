process.env.NODE_ENV = 'test';

import * as dailyUpdateService from '../../services/dailyUpdateService';
import Contract from '../../models/Contract';
import Subscriber from '../../models/Subscriber';
import { sendSMS } from '../../services/smsService';

jest.mock('../../models/Contract');
jest.mock('../../models/Subscriber');
jest.mock('../../services/smsService');

describe('dailyUpdateService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateDailyUpdate', () => {
    it('should generate a daily update message', async () => {
      const mockContracts = [
        { name: 'Contract 1', currentPrice: 0.75 },
        { name: 'Contract 2', currentPrice: 0.50 },
      ];
      (Contract.find as jest.Mock).mockReturnValue({
        sort: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockContracts)
        })
      });

      const result = await dailyUpdateService.generateDailyUpdate();
      expect(result).toContain('Daily Update:');
      expect(result).toContain('Contract 1: 0.75');
      expect(result).toContain('Contract 2: 0.50');
    });
  });

  describe('scheduleDailyUpdates', () => {
    it('should send updates to active subscribers', async () => {
      const mockSubscribers = [
        { phoneNumber: '+1234567890' },
        { phoneNumber: '+9876543210' },
      ];
      (Subscriber.find as jest.Mock).mockResolvedValue(mockSubscribers);
      
      const mockUpdate = 'Daily Update:\n1. Contract 1: 0.75\n2. Contract 2: 0.50\n';
      jest.spyOn(dailyUpdateService, 'generateDailyUpdate').mockResolvedValue(mockUpdate);

      await dailyUpdateService.scheduleDailyUpdates();

      expect(sendSMS).toHaveBeenCalledTimes(2);
      expect(sendSMS).toHaveBeenCalledWith('+1234567890', mockUpdate);
      expect(sendSMS).toHaveBeenCalledWith('+9876543210', mockUpdate);
    });
  });
});