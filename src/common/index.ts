import jwt from 'jsonwebtoken';
export const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '99999999m',
  });
};
