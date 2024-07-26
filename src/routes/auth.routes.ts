import { Router } from 'express';
import userController from '../controllers/user.controller';
import userSchema from '../schemas/userSchema';
import { validateRequest, validateUserToken } from '../middlewares';
import loginSchema from '../schemas/loginSchema';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.Model';

const authRouter = Router();
const otps = {}; // Store OTPs with expiry times

const generateOtp = () => {
  return crypto.randomBytes(3).toString('hex'); // Generate a 6-digit OTP
};

authRouter
  .get('/', validateUserToken, userController.getUserByToken)
  .post('/register', validateRequest(userSchema), userController.addUser)
  .post('/login', validateRequest(loginSchema), userController.loginUser)

  .post('/send-otp', (req, res) => {
    const { email } = req.body;

    const otp = generateOtp();
    const expiry = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes

    otps[email] = { otp, expiry };

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'advisorswipe@gmail.com',
        pass: 'zump rapj tpxe tmhy',
      },
    });

    const mailOptions = {
      from: 'advisorswipe@gmail.com',
      to: email,
      subject: 'SwipeAdvisor - Reset password',
      text: `Your OTP code is ${otp}`,
      html: `<h1>Your OTP code is ${otp}</h1>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).send(error);
      }
      res.status(200).send('OTP sent');
    });
  })

  .post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = otps[email];

    if (!storedOtp || storedOtp.expiry < Date.now()) {
      return res.status(400).send('OTP expired');
    }

    if (storedOtp.otp !== otp) {
      return res.status(400).send('Invalid OTP');
    }

    res.status(200).send('OTP verified');
  })
  .post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    const currentUser = await User.findOne({ email });
    if (!currentUser) {
      return res.status(404).send('User not found');
    }
    currentUser.password = newPassword;

    await currentUser.save();

    res.status(200).send('Password reset successful');
  });

export default authRouter;
