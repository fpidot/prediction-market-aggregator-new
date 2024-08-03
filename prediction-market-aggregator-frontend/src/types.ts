export interface AuthResponse {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }