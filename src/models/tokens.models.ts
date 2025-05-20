// --- ACCESS TOKEN ---
export interface JwtPayload {
  sub: string;          
  email: string;
  role: string;
  iat: number;
  exp: number;
}

// --- REFRESH TOKEN ---    
export interface RefreshToken {
  uuid: string;
  user_uuid: string;
  token: string;              
  expires_at: string;
  created_at: string;
  revoked: boolean;
}

export interface Session {
  uuid: string;
  user_uuid: string;
  ip_address: string;
  user_agent: string;
  created_at: string;
  last_active_at: string;
  expires_at: string;
  is_active: boolean;
}