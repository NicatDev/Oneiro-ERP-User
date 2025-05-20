import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';

sqlite3.verbose();

let db: Database;

export const initDB = async () => {
  if (db) return db;

  db = await open({
    filename: path.join(__dirname, '../../db.sqlite'),
    driver: sqlite3.Database
  });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      uuid TEXT PRIMARY KEY,
      first_name TEXT,
      last_name TEXT,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      email TEXT,
      phone_number TEXT,
      created_at TEXT,
      last_login TEXT,
      is_active INTEGER
    );

    CREATE TABLE IF NOT EXISTS sessions (
      uuid TEXT PRIMARY KEY,
      user_uuid TEXT NOT NULL,
      ip_address TEXT,
      user_agent TEXT,
      created_at TEXT,
      last_active_at TEXT,
      expires_at TEXT,
      is_active INTEGER
    );

    CREATE TABLE IF NOT EXISTS refresh_tokens (
      uuid TEXT PRIMARY KEY,
      user_uuid TEXT NOT NULL,
      token TEXT,
      expires_at TEXT,
      created_at TEXT,
      revoked INTEGER
    );

    CREATE TABLE IF NOT EXISTS roles (
      uuid TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      created_at TEXT
    );
    
    CREATE TABLE IF NOT EXISTS form_permissions (
      uuid TEXT PRIMARY KEY,
      role_uuid TEXT NOT NULL,
      form_uuid TEXT NOT NULL,
      permission TEXT
    );
    
    CREATE TABLE IF NOT EXISTS modules (
      uuid TEXT PRIMARY KEY,
      name TEXT,
      description TEXT,
      icon TEXT,
      path TEXT
    );

    CREATE TABLE IF NOT EXISTS forms (
      uuid TEXT PRIMARY KEY,
      module_uuid TEXT NOT NULL,
      name TEXT,
      description TEXT,
      icon TEXT,
      path TEXT
    );
  `);

  console.log('✅ Veritabanı hazır.');
  return db;
};