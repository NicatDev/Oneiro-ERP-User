import { generateUuid } from './../utils/uuidGenerator';
import { Request, Response } from 'express';
import pool from '../config/database';  // pg pool importu
import { User } from '../models/user.models';
import { sortData, filterData, searchData } from '../utils/queryBuilder';
import bcrypt from 'bcryptjs';

const allowedFields = ['first_name', 'last_name', 'email', 'username', 'phone_number', 'is_active'];
const allowedUpdateFields = ['first_name', 'last_name', 'email', 'username'];

export const updateUser = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const updates = req.body;

  if (!uuid) {
    return res.status(400).json({ message: 'No uuid found.' });
  }

  try {
    const fieldsToUpdate: string[] = [];
    const values: any[] = [];

    allowedUpdateFields.forEach((field, index) => {
      if (updates[field] !== undefined) {
        // pg parametreler $1, $2, ... formatında
        fieldsToUpdate.push(`${field} = $${index + 1}`);
        values.push(updates[field]);
      }
    });

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ message: 'No field to update.' });
    }

    values.push(uuid);
    const query = `UPDATE users SET ${fieldsToUpdate.join(', ')} WHERE uuid = $${values.length}`;

    await pool.query(query, values);

    const { rows } = await pool.query('SELECT * FROM users WHERE uuid = $1', [uuid]);
    const updatedUser = rows[0];

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

export const getUserFilterableDatas = async (req: Request, res: Response) => {
  const field = req.query.field as string;

  if (!field || !allowedFields.includes(field)) {
    return res.status(400).json({ message: 'Invalid or missing field parameter' });
  }

  try {
    const query = `SELECT DISTINCT ${field} FROM users WHERE ${field} IS NOT NULL`;
    const { rows } = await pool.query(query);

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
    const { query: filterQuery, params: filterParams } = filterData(filters);
    const { query: searchQuery, params: searchParams } = searchData(filters.search, filterParams.length + 1);
    const { query: sortQuery } = sortData(filters);

    let query = `SELECT * FROM users ${filterQuery}`;
    let queryParams = [...filterParams, ...searchParams];

    if (filterQuery || searchQuery) {
      query += ' WHERE ';
      const conditions = [];
      if (filterQuery) {
        conditions.push(filterQuery.replace(/^WHERE\s+/i, ''));
      }
      if (searchQuery) {
        conditions.push(searchQuery);
      }
      query += conditions.join(' AND ');
    }

    query += ` ${sortQuery} LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
    queryParams.push(pageSize, offset);

    const { rows: users } = await pool.query(query, queryParams);

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

  if (!first_name) {
    return res.status(400).json({ message: 'First name is required.' });
  } else if (!last_name) {
    return res.status(400).json({ message: 'Last name is required.' });
  } else if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  } else if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  } else if (!password_hash) {
    return res.status(400).json({ message: 'Password is required.' });
  } else if (password_hash?.length < 5) {
    return res.status(400).json({ message: 'Password is too short.' });
  }

  try {
    const checkQuery = `
      SELECT * FROM users WHERE username = $1 OR email = $2
    `;
    const { rows: existingUsers } = await pool.query(checkQuery, [username, email]);

    if (existingUsers.length > 0) {
      const usernameExists = existingUsers.some(user => user.username === username);
      const emailExists = existingUsers.some(user => user.email === email);

      let message = '';
      if (usernameExists && emailExists) {
        message = 'Username and Email are already in use.';
      } else if (usernameExists) {
        message = 'Username is already in use.';
      } else if (emailExists) {
        message = 'Email is already in use.';
      }

      return res.status(400).json({ message });
    }

    const userUuid = generateUuid();
    const createdAt = new Date().toISOString();
    const passwordHash = await bcrypt.hash(password_hash, 10);

    const insertQuery = `
      INSERT INTO users (uuid, first_name, last_name, username, email, phone_number, created_at, password_hash, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;

    const { rows } = await pool.query(insertQuery, [
      userUuid,
      first_name,
      last_name,
      username,
      email,
      phone_number,
      createdAt,
      passwordHash,
      is_active ? 1 : 0,
    ]);

    const newUser = rows[0];

    return res.status(201).json(newUser);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'An error occurred while creating the user.' });
  }
};


export const changeStatus = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { is_active } = req.body;

  if (!uuid || typeof is_active !== 'boolean') {
    return res.status(400).json({ message: 'UUID and is_active must be provided.' });
  }

  try {
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE uuid = $1', [uuid]);

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı.' });
    }

    await pool.query('UPDATE users SET is_active = $1 WHERE uuid = $2', [is_active ? 1 : 0, uuid]);

    const { rows: updatedUsers } = await pool.query('SELECT * FROM users WHERE uuid = $1', [uuid]);

    res.status(200).json({
      message: `İstifadəçi statusu ${is_active ? 'aktiv edildi' : 'deaktiv edildi'}.`,
      user: updatedUsers[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Status dəyişdirilərkən server xətası baş verdi.' });
  }
};


export const getSingleUser = async (req: Request, res: Response) => {
  const { uuid } = req.params;

  if (!uuid) {
    return res.status(400).json({ message: 'UUID parametresi gereklidir.' });
  }

  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE uuid = $1', [uuid]);

    if (rows.length === 0) {
      console.log(rows, '--')
      return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    const user = rows[0];
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Kullanıcı getirilemedi. Sunucu hatası oluştu.' });
  }
};


export const getDropdownList = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const pageSize = parseInt(req.query.pageSize as string) || 10;
  const offset = (page - 1) * pageSize;

  try {
    const countQuery = `SELECT COUNT(*) FROM users WHERE is_active = true`;
    const { rows: countRows } = await pool.query(countQuery);
    const total = parseInt(countRows[0].count);

    const query = `
      SELECT uuid AS value, CONCAT(first_name, ' ', last_name) AS name
      FROM users
      WHERE is_active = true
      ORDER BY first_name, last_name
      LIMIT $1 OFFSET $2
    `;
    const { rows } = await pool.query(query, [pageSize, offset]);

    res.status(200).json({
      data: rows,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error('Dropdown list error:', error);
    res.status(500).json({ message: 'Server error. Dropdown list could not be retrieved.' });
  }
};


export const resetPassword = async (req: Request, res: Response) => {
  const { uuid } = req.params;
  const { password_hash } = req.body;

  if (!uuid) {
    return res.status(400).json({ message: 'UUID tələb olunur.' });
  }

  if (!password_hash || typeof password_hash !== 'string') {
    return res.status(400).json({ message: 'Yeni şifrə göndərilməlidir.' });
  }

  if (password_hash.length < 5) {
    return res.status(400).json({ message: 'Şifrə çox qısadır (minimum 5 simvol).' });
  }

  try {
    const { rows: existingUsers } = await pool.query('SELECT * FROM users WHERE uuid = $1', [uuid]);

    if (existingUsers.length === 0) {
      return res.status(404).json({ message: 'İstifadəçi tapılmadı.' });
    }

    const hashedPassword = await bcrypt.hash(password_hash, 10);

    await pool.query('UPDATE users SET password_hash = $1 WHERE uuid = $2', [hashedPassword, uuid]);

    res.status(200).json({ message: 'Şifrə uğurla yeniləndi.' });
  } catch (error) {
    console.error('resetPassword error:', error);
    res.status(500).json({ message: 'Server xətası baş verdi. Şifrə yenilənmədi.' });
  }
};