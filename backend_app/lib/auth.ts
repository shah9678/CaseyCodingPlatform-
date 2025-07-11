import bcrypt from 'bcryptjs';
import { Db } from 'mongodb';

interface User {
  email: string;
  password: string;
  // Add other fields as needed
}

export async function createUser(db: Db, user: User) {
  const hashedPassword = await bcrypt.hash(user.password, 10);
  return db.collection('users').insertOne({
    ...user,
    password: hashedPassword,
    createdAt: new Date(),
  });
}

export async function findUserByEmail(db: Db, email: string) {
  return db.collection('users').findOne({ email });
}

export async function verifyPassword(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}