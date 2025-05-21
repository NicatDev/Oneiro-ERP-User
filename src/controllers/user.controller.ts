import { Request, Response } from 'express';
import { initDB } from '../config/database';
import { User } from '../models/user.models';
import { sortData, filterData, searchData } from '../utils/queryBuilder';
import bcrypt from 'bcryptjs';


const allowedFields = ['first_name', 'last_name', 'email', 'username', 'phone_number', 'is_active'];
const allowedUpdateFields = ['first_name', 'last_name', 'email', 'username'];

export const updateUser = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const updates = req.body;

  if (!uuid) {
    return res.status(400).json({ message: 'UUID belirtilmelidir.' });
  }

  try {
    const db = await initDB();

    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    allowedUpdateFields.forEach((field) => {
      if (updates[field] !== undefined) {
        fieldsToUpdate.push(`${field} = ?`);
        values.push(updates[field]);
      }
    });

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'Güncellenecek geçerli bir alan belirtilmedi.' });
    }

    const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE uuid = ?`;
    values.push(uuid);

    await db.run(query, values);

    const updatedUser = await db.get('SELECT * FROM users WHERE uuid = ?', [uuid]);

    if (!updatedUser) {
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kullanıcı güncellenirken bir hata oluştu.' });
  }
};


export const getUserFilterableDatas = async (req: Request, res: Response) => {
  const field = req.query.field as string;

  if (!field || !allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid or missing field parameter' });
  }

  try {
    const db = await initDB();

    const query = `SELECT DISTINCT ${field} FROM users WHERE ${field} IS NOT NULL`;
    const rows = await db.all(query);

    const values = rows.map(row => row[field]);

    res.status(200).json({ data: values });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: 'An unexpected error occurred.' });
  }
};


export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const offset = (page - 1) * pageSize;

  const filters = req.query as { [key: string]: string | undefined };

  try {
    const db = await initDB();

    const { query: filterQuery, params: filterParams } = filterData(filters);
    const { query: searchQuery, params: searchParams } = searchData(filters.search);
    const { query: sortQuery } = sortData(filters);

    let query = `SELECT * FROM users ${filterQuery}`;
    let queryParams = [...filterParams, ...searchParams];

    if (searchQuery) {
      query += filterQuery ? ` AND ${searchQuery}` : ` WHERE ${searchQuery}`;
    }

    query += ` ${sortQuery} LIMIT ? OFFSET ?`;
    queryParams.push(pageSize, offset);

    const users: User[] = await db.all(query, queryParams);

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: 'An unexpected error occurred.' });
  }
};


export const createUser = async (req: Request, res: Response) => {
  const { first_name, last_name, username, email, phone_number, password_hash, is_active } = req.body;
  const db = await initDB();
  if (!first_name || !last_name || !username) {
    return res.status(400).json({ message: 'First name, last name, and username are required.' });
  }

  try {
    const userUuid = generateUuid();
    const createdAt = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password_hash, 10);

    await db.run(`
      INSERT INTO users (uuid, first_name, last_name, username, email, phone_number, created_at, password_hash, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [userUuid, first_name, last_name, username, email, phone_number, createdAt, passwordHash, is_active ? 1 : 0]
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