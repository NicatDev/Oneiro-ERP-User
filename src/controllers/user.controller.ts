import { Request, Response } from 'express';
import { initDB } from '../config/database';

export const getUsers = async (req: Request, res: Response) => {
  const db = await initDB();
  const users = await db.all('SELECT * FROM users');
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const db = await initDB();
    await db.run('INSERT INTO users (name, email) VALUES (?, ?)', [name, email]);
    res.status(201).json({ message: 'User created' });
  } catch (err: any) {
    if (err.code === 'SQLITE_CONSTRAINT') {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
};