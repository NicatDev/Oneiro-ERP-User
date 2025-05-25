import { Request, Response } from 'express';
import pool from '../config/database';
import { v4 as uuidv4 } from 'uuid';
import { Module } from '../models/modules.models';
import { Form } from '../models/forms.models';

export const getModules = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        uuid AS module_uuid,
        name AS module_name,
        description AS module_description,
        icon AS module_icon,
        path AS module_path
      FROM modules
    `;

    const result = await pool.query(query);
    const rows = result.rows;

    const modules = rows.map(row => ({
      uuid: row.module_uuid,
      name: row.module_name,
      description: row.module_description,
      icon: row.module_icon,
      path: row.module_path
    }));

    res.status(200).json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const createModule = async (req: Request, res: Response) => {
  try {
    const { name, description, icon, path } = req.body;

    if (!name || !path) {
      return res.status(400).json({ message: 'Name and path are required.' });
    }

    const uuid = uuidv4();

    const query = `
      INSERT INTO modules (uuid, name, description, icon, path)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING uuid, name, description, icon, path
    `;

    const values = [uuid, name, description, icon, path];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};


export const getSingleModuleWithForms = async (req: Request, res: Response) => {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      return res.status(400).json({ message: 'Module UUID gereklidir.' });
    }

    // İlk olarak modülü al
    const moduleQuery = `
      SELECT 
        uuid AS module_uuid,
        name AS module_name,
        description AS module_description,
        icon AS module_icon,
        path AS module_path
      FROM modules
      WHERE uuid = $1
    `;
    const moduleResult = await pool.query(moduleQuery, [uuid]);

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Modül bulunamadı.' });
    }

    const module = {
      uuid: moduleResult.rows[0].module_uuid,
      name: moduleResult.rows[0].module_name,
      description: moduleResult.rows[0].module_description,
      icon: moduleResult.rows[0].module_icon,
      path: moduleResult.rows[0].module_path
    };

    // Modüle bağlı formları al
    const formsQuery = `
      SELECT 
        uuid,
        module_uuid,
        name,
        description,
        icon,
        path
      FROM forms
      WHERE module_uuid = $1
    `;
    const formsResult = await pool.query(formsQuery, [uuid]);

    const forms = formsResult.rows.map(row => ({
      uuid: row.uuid,
      module_uuid: row.module_uuid,
      name: row.name,
      description: row.description,
      icon: row.icon,
      path: row.path
    }));

    res.status(200).json({ module, forms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Sunucu hatası.' });
  }
};


export const createForm = async (req: Request, res: Response) => {
  try {
    const { module_uuid, name, description, icon, path } = req.body;

    if (!module_uuid || !name || !path) {
      return res.status(400).json({ message: 'module_uuid, name ve path zorunludur.' });
    }

    const moduleCheck = await pool.query(
      'SELECT uuid FROM modules WHERE uuid = $1',
      [module_uuid]
    );

    if (moduleCheck.rows.length === 0) {
      return res.status(404).json({ message: 'İlgili modül bulunamadı.' });
    }

    const uuid = uuidv4();

    const query = `
      INSERT INTO forms (uuid, module_uuid, name, description, icon, path)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING uuid, module_uuid, name, description, icon, path
    `;

    const values = [uuid, module_uuid, name, description, icon, path];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Form oluşturulurken sunucu hatası oluştu.' });
  }
};