import randomstring from 'randomstring';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

const generateAccessToken = (id: string, key: string): string => {
  return sign({ id }, key);
};

const verifyToken = (token: string, key: string): JwtPayload => {
  return verify(token, key) as JwtPayload;
};

const generateRandomString = (): string => {
  return randomstring.generate(process.env.RANDOM_STRING_LENGTH);
};

const generateOtp = (): number => {
  return randomstring.generate({ length: 4, charset: 'numeric' });
};

export { generateAccessToken, verifyToken, generateRandomString, generateOtp };
