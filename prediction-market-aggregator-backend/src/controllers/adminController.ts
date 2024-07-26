import { Request, Response } from 'express';
import Contract from '../models/Contract';
import Subscriber from '../models/Subscriber';
import BigMoveThreshold from '../models/BigMoveThreshold';

export const getAllContracts = async (req: Request, res: Response) => {
  try {
    const contracts = await Contract.find();
    res.json(contracts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contracts', error });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const newContract = new Contract(req.body);
    await newContract.save();
    res.status(201).json(newContract);
  } catch (error) {
    res.status(400).json({ message: 'Error creating contract', error });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  try {
    const updatedContract = await Contract.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json(updatedContract);
  } catch (error) {
    res.status(400).json({ message: 'Error updating contract', error });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const deletedContract = await Contract.findByIdAndDelete(req.params.id);
    if (!deletedContract) {
      return res.status(404).json({ message: 'Contract not found' });
    }
    res.json({ message: 'Contract deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contract', error });
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await Subscriber.find();
    res.json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const updatedSubscription = await Subscriber.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedSubscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }
    res.json(updatedSubscription);
  } catch (error) {
    res.status(400).json({ message: 'Error updating subscription', error });
  }
};

export const getThresholds = async (req: Request, res: Response) => {
  try {
    const thresholds = await BigMoveThreshold.findOne();
    res.json(thresholds);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching thresholds', error });
  }
};

export const updateThresholds = async (req: Request, res: Response) => {
  try {
    const updatedThresholds = await BigMoveThreshold.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(updatedThresholds);
  } catch (error) {
    res.status(400).json({ message: 'Error updating thresholds', error });
  }
};