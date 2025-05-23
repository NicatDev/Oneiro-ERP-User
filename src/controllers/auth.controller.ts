import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
// LOGIN
export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const accessTokenPayload = {
      sub: user.uuid,
      email: user.email || '',
      role: 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 saat
    };

    const accessToken = jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET);

    const refreshToken = jwt.sign({ sub: user.uuid }, REFRESH_TOKEN_SECRET, {
      expiresIn: '10y',
    });

    const refreshTokenData = {
      uuid: uuidv4(),
      user_uuid: user.uuid,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date().toISOString(),
      revoked: false,
    };

    await pool.query(
      `INSERT INTO refresh_tokens (uuid, user_uuid, token, expires_at, created_at, revoked) 
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        refreshTokenData.uuid,
        refreshTokenData.user_uuid,
        refreshTokenData.token,
        refreshTokenData.expires_at,
        refreshTokenData.created_at,
        refreshTokenData.revoked,
      ]
    );

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};

// REFRESH TOKEN
export const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_SECRET) as any;

    const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refresh_token]);
    const storedToken = result.rows[0];

    if (!storedToken || storedToken.revoked) {
      return res.status(403).json({ message: 'Invalid or revoked refresh token' });
    }

    const newAccessTokenPayload = {
      sub: decoded.sub,
      email: decoded.email || '',
      role: 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const newAccessToken = jwt.sign(newAccessTokenPayload, ACCESS_TOKEN_SECRET);

    res.json({
      access_token: newAccessToken,
      refresh_token,
    });
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

// LOGOUT
export const logout = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  try {
    const result = await pool.query('SELECT * FROM refresh_tokens WHERE token = $1', [refresh_token]);
    const tokenData = result.rows[0];

    if (!tokenData || tokenData.revoked) {
      return res.status(400).json({ message: 'Token is not valid' });
    }

    await pool.query('UPDATE refresh_tokens SET revoked = true WHERE token = $1', [refresh_token]);

    res.status(200).json({ message: 'Log out' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
