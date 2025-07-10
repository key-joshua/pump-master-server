import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.log('❌ DATABASE_URL is not defined in .env.');
}

mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('✅ Mongodb connected successfully.'))
.catch((error) => console.log(`❌ Mongodb error ${error}`));