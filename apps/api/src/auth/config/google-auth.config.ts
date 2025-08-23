import { registerAs } from '@nestjs/config';

export default registerAs('google-auth', () => ({
  clientID: process.env.AUTH_GOOGLE_ID,
  clientSecret: process.env.AUTH_GOOGLE_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}));
