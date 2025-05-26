
const API_BASE_URL = 'https://b6f0-46-1-181-143.ngrok-free.app/api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
}

export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface ValidationError {
  [key: string]: string[];
}

export interface ApiError {
  success: false;
  message: string;
}

class AuthService {
  private token: string | null = null;
  private user: User | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('auth_user');
    if (userData) {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error('Error parsing user data:', e);
        this.clearAuth();
      }
    }
  }

  async login(email: string, password: string): Promise<{ success: boolean; data?: AuthResponse['data']; errors?: ValidationError | ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.setAuth(data.data.token, data.data.user);
        return { success: true, data: data.data };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  async register(firstName: string, lastName: string, email: string, password: string): Promise<{ success: boolean; data?: AuthResponse['data']; errors?: ValidationError | ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ 
          first_name: firstName, 
          last_name: lastName, 
          email, 
          password 
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        this.setAuth(data.data.token, data.data.user);
        return { success: true, data: data.data };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  private setAuth(token: string, user: User): void {
    this.token = token;
    this.user = user;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  clearAuth(): void {
    this.token = null;
    this.user = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  isAuthenticated(): boolean {
    return !!this.token && !!this.user;
  }

  getUser(): User | null {
    return this.user;
  }

  getToken(): string | null {
    return this.token;
  }
}

export const authService = new AuthService();
