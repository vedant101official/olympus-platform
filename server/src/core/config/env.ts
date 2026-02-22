import dotenv from 'dotenv';

dotenv.config();

export const env = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://olympus-platform-user-1:user-1@olympuscluster.oaxspwk.mongodb.net/',
  JWT_SECRET: process.env.JWT_SECRET || 'fd9cbab2788352a52b1b8c1ce06e712797f84fd7db2deb98087cb50a04476d01f14d8956a04fec8f9be98253f3c0154866a030b6218325b820c7a10895f7e9fa',
};