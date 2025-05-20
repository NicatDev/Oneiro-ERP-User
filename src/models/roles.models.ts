export interface Role {
  uuid: string;
  name: string; 
  description?: string;
  created_at: string;
}

export interface FormPermission {
  uuid: string;
  role_uuid: string;
  form_uuid: string;
  permission: 'no_access'|'read'|'read_write'|string;
}