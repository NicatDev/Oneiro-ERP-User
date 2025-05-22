import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { initDB } from '../config/database';
import { User } from '../models/user.models';
import { JwtPayload, RefreshToken } from '../models/tokens.models';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || '6e5bb5cf5326f17f43fa77989138e719a4b058136dddabdff3ece7ab37eb781858c7b4f9e1b5a07c5ad646034520bc5b1692802c6af36b300f63412299b6fba7';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'bd7d4d618ec24df71b82d85ae6eb644abbb9324857dce2a647179236e288cedbb5c7fe449fb5bcaa72f7661707012947fe30e884b1d8d99e97fa2a669323f234';


export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const db = await initDB();

    const user: User | undefined = await db.get('SELECT * FROM users WHERE username = ?', [username]);
    if (!user) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Geçersiz kullanıcı adı veya şifre.' });
    }

    const accessTokenPayload: JwtPayload = {
      sub: user.uuid,
      email: user.email || '',
      role: 'user',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), 
    };
    const accessToken = jwt.sign(accessTokenPayload, ACCESS_TOKEN_SECRET);

    const refreshToken: string = jwt.sign({ sub: user.uuid }, REFRESH_TOKEN_SECRET, {
      expiresIn: '10y', 
    });

    const refreshTokenData: RefreshToken = {
      uuid: new Date().toISOString(),
      user_uuid: user.uuid,
      token: refreshToken,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 gün sonra
      created_at: new Date().toISOString(),
      revoked: false,
    };

    await db.run('INSERT INTO refresh_tokens (uuid, user_uuid, token, expires_at, created_at, revoked) VALUES (?, ?, ?, ?, ?, ?)', [
      refreshTokenData.uuid,
      refreshTokenData.user_uuid,
      refreshTokenData.token,
      refreshTokenData.expires_at,
      refreshTokenData.created_at,
      refreshTokenData.revoked ? 1 : 0,
    ]);

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};


export const logout = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  try {
    const db = await initDB();

    const tokenData: RefreshToken | undefined = await db.get('SELECT * FROM refresh_tokens WHERE token = ?', [refresh_token]);
    if (!tokenData || tokenData.revoked) {
      return res.status(400).json({ message: 'Token is not valid' });
    }

    await db.run('UPDATE refresh_tokens SET revoked = 1 WHERE token = ?', [refresh_token]);

    res.status(200).json({ message: 'Log out' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};