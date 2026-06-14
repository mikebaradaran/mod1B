import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({ username: String, message: String, timestamp: { type: Date, default: Date.now } });
const Message = mongoose.model('Message', messageSchema);

async function insertTest() {
  const msg = new Message({ username: "Test", message: "Hello Atlas!" });
  await msg.save();
  console.log("Inserted message into MongoDB!");
  mongoose.disconnect();
}

insertTest();
