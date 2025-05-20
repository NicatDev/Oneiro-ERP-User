import { Request, Response } from 'express';
import { initDB } from '../config/database';
import { User } from '../models/user.models';


export const getUsers = async (req: Request, res: Response) => {
  const db = await initDB();
  const users = await db.all('SELECT * FROM users');
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { first_name, last_name, username, email, phone_number, is_active } = req.body;
  const db = await initDB();
  if (!first_name || !last_name || !username) {
    return res.status(400).json({ message: 'First name, last name, and username are required.' });
  }

  try {
    const userUuid = generateUuid();
    const createdAt = new Date().toISOString();

    await db.run(`
      INSERT INTO users (uuid, first_name, last_name, username, email, phone_number, created_at, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
      [userUuid, first_name, last_name, username, email, phone_number, createdAt, is_active ? 1 : 0]
    );

    const newUser = await db.get('SELECT * FROM users WHERE uuid = ?', [userUuid]);

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the user.' });
  }
};

const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};