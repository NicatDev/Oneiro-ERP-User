import { Pool } from 'pg';

const pool = new Pool({
  user: 'oneiro',
  host: '135.181.198.134', 
  database: 'oneiro_db',
  password: 'Oneiro-123',
  port: 5432,
});


export const initDB = async () => {
  try {
    // users cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        uuid UUID PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        email TEXT UNIQUE,
        phone_number TEXT,
        created_at TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN
      );
    `);

    // sessions cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        uuid UUID PRIMARY KEY,
        user_uuid UUID NOT NULL,
        ip_address TEXT,
        user_agent TEXT,
        created_at TIMESTAMP,
        last_active_at TIMESTAMP,
        expires_at TIMESTAMP,
        is_active BOOLEAN
      );
    `);

    // refresh_tokens cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS refresh_tokens (
        uuid UUID PRIMARY KEY,
        user_uuid UUID NOT NULL,
        token TEXT,
        expires_at TIMESTAMP,
        created_at TIMESTAMP,
        revoked BOOLEAN
      );
    `);

    // roles cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS roles (
        uuid UUID PRIMARY KEY,
        name TEXT,
        description TEXT,
        created_at TIMESTAMP
      );
    `);

    // form_permissions cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS form_permissions (
        uuid UUID PRIMARY KEY,
        role_uuid UUID NOT NULL,
        form_uuid UUID NOT NULL,
        permission TEXT
      );
    `);

    // modules cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS modules (
        uuid UUID PRIMARY KEY,
        name TEXT,
        description TEXT,
        icon TEXT,
        path TEXT
      );
    `);

    // forms cədvəli
    await pool.query(`
      CREATE TABLE IF NOT EXISTS forms (
        uuid UUID PRIMARY KEY,
        module_uuid UUID NOT NULL,
        name TEXT,
        description TEXT,
        icon TEXT,
        path TEXT
      );
    `);

    console.log('✅ PostgreSQL DB initialized.');
  } catch (err) {
    console.error('❌ Error initializing DB:', err);
  }
};

initDB()

export default pool;