import User from '../models/userModel.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const getUserSettings = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({
      email: user.email,
      apiKeys: {
        openai: decrypt(user.apiKeys?.openai),
        pexels: decrypt(user.apiKeys?.pexels),
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const updateApiKeys = async (req, res) => {
  try {
    const { openai, pexels } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.apiKeys = {
      openai: encrypt(openai),
      pexels: encrypt(pexels),
    };
    await user.save();
    res.status(200).json({ message: 'API keys updated successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const changePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.user.id).select('+password');
    if (!user || !(await user.matchPassword(oldPassword))) {
      return res.status(401).json({ message: 'Incorrect old password.' });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: 'Password changed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};