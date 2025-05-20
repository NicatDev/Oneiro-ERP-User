import { Request, Response } from 'express';
import { initDB } from '../config/database';
import { User } from '../models/user.models';
import bcrypt from 'bcryptjs';

const filterUsers = (filters: { [key: string]: string | undefined }): { query: string, params: any[] } => {
  let filterConditions: string[] = [];
  let queryParams: any[] = [];

  Object.keys(filters).forEach((key) => {
    if (key.startsWith('filter[')) {
      const fieldName = key.replace('filter[', '').replace(']', '');
      if (filters[key] === '') {
        return;
      }

      if (fieldName !== 'password' && fieldName !== 'last_login') {
        filterConditions.push(`${fieldName} = ?`);
        queryParams.push(filters[key]);
      }
    }
  });

  const query = filterConditions.length > 0 ? `WHERE ${filterConditions.join(' AND ')}` : '';
  return { query, params: queryParams };
};

const searchUsers = (searchTerm: string | undefined): { query: string, params: any[] } => {
  let searchConditions: string[] = [];
  let queryParams: any[] = [];

  if (searchTerm) {
    const searchValue = searchTerm.toLowerCase(); 

    const searchFields = ['first_name', 'last_name', 'email', 'phone_number'];

    searchFields.forEach((field) => {
      searchConditions.push(`${field} LIKE ?`);
      queryParams.push(`%${searchValue}%`); 
    });
  }

  const query = searchConditions.length > 0 ? `(${searchConditions.join(' OR ')})` : '';
  return { query, params: queryParams };
};

const sortUsers = (filters: { [key: string]: string | undefined }): { query: string, params: any[] } => {
  const sortField = Object.keys(filters).find(key => key.startsWith('sort['))?.replace('sort[', '').replace(']', ''); 

  let sortOrder: 'ASC' | 'DESC' | undefined;
  if (sortField) {
    const order = filters[`sort[${sortField}]`];
    if (order === 'desc') {
      sortOrder = 'DESC';
    } else if (order === 'asc') {
      sortOrder = 'ASC';
    }
  }

  const query = sortField && sortOrder ? `ORDER BY ${sortField} ${sortOrder}` : '';
  return { query, params: [] };
};

export const getUsers = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;  
  const pageSize = parseInt(req.query.pageSize as string) || 10;  
  const offset = (page - 1) * pageSize;

  const filters = req.query as { [key: string]: string | undefined };

  try {
    const db = await initDB();

    const { query: filterQuery, params: filterParams } = filterUsers(filters);
    const { query: searchQuery, params: searchParams } = searchUsers(filters.search);
    const { query: sortQuery } = sortUsers(filters);

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