import { Request, Response } from 'express';
import pool from '../config/database';  // pool'u import et

export const getModulesWithForms = async (req: Request, res: Response) => {
  try {
    const query = `
      SELECT 
        m.uuid AS module_uuid,
        m.name AS module_name,
        m.description AS module_description,
        m.icon AS module_icon,
        m.path AS module_path,
        f.uuid AS form_uuid,
        f.name AS form_name,
        f.description AS form_description,
        f.icon AS form_icon,
        f.path AS form_path
      FROM modules m
      LEFT JOIN forms f ON m.uuid = f.module_uuid
    `;

    const result = await pool.query(query);
    const rows = result.rows;

    const modulesMap: { [key: string]: any } = {};

    rows.forEach(row => {
      if (!modulesMap[row.module_uuid]) {
        modulesMap[row.module_uuid] = {
          uuid: row.module_uuid,
          name: row.module_name,
          description: row.module_description,
          icon: row.module_icon,
          path: row.module_path,
          forms: []
        };
      }

      if (row.form_uuid) {
        modulesMap[row.module_uuid].forms.push({
          uuid: row.form_uuid,
          name: row.form_name,
          description: row.form_description,
          icon: row.form_icon,
          path: row.form_path
        });
      }
    });

    const resultArray = Object.values(modulesMap);

    res.status(200).json(resultArray);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Modul və formalar gətirilərkən xəta baş verdi.' });
  }
};