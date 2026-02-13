import 'dotenv/config';
import connectDB from "./config/db.js";
import app from "./app.js";
import User from './models/User.js';

const PORT = process.env.PORT || 5000;
const ADMIN_EMAIL = 'veronica@gmail.com';
const ADMIN_PASSWORD = 'veronica';

const ensureSpecialAdmin = async () => {
  const existing = await User.findOne({ email: ADMIN_EMAIL }).select('+password');

  if (!existing) {
    await User.create({
      username: 'Veronica',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      role: 'admin',
    });
    console.log(`Seeded admin user: ${ADMIN_EMAIL}`);
    return;
  }

  let shouldSave = false;
  if (existing.role !== 'admin') {
    existing.role = 'admin';
    shouldSave = true;
  }

  const passwordOk = await existing.comparePassword(ADMIN_PASSWORD);
  if (!passwordOk) {
    existing.password = ADMIN_PASSWORD;
    shouldSave = true;
  }

  if (shouldSave) {
    await existing.save();
    console.log(`Updated special admin credentials for: ${ADMIN_EMAIL}`);
  }
};

connectDB().then(() => {
  return ensureSpecialAdmin();
}).then(() => {
  app.listen(PORT,()=>{
      console.log(`Server is running on http://localhost:${PORT}`)
  })
}).catch((err) => console.error("Database connection failed", err));
