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

  return db;
};