const API_BASE_URL = 'https://b6f0-46-1-181-143.ngrok-free.app/api';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_image: string | null;
  subscription_expiry_date?: string;
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

export interface ProfileUpdateData {
  first_name: string;
  last_name: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface SubscriptionData {
  expiry_date: string;
  remaining_days: number;
  plan_name?: string;
  is_active?: boolean;
}

export interface PersonalInfoUpdateData {
  first_name: string;
  last_name: string;
}

export interface PasswordUpdateData {
  current_password: string;
  password: string;
  password_confirmation: string;
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

  async updatePersonalInfo(personalData: PersonalInfoUpdateData): Promise<{ success: boolean; data?: User; errors?: ValidationError | ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(personalData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the local user data
        if (data.data && data.data.user) {
          this.user = data.data.user;
          localStorage.setItem('auth_user', JSON.stringify(this.user));
        }
        return { success: true, data: data.data?.user };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Personal info update error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  async updatePassword(passwordData: PasswordUpdateData): Promise<{ success: boolean; errors?: ValidationError | ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Password update error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  async getProfile(): Promise<{ success: boolean; data?: User; errors?: ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/show`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the local user data
        if (data.data && data.data.user) {
          this.user = data.data.user;
          localStorage.setItem('auth_user', JSON.stringify(this.user));
        }
        return { success: true, data: data.data?.user };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Profile fetch error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  async updateProfile(profileData: ProfileUpdateData): Promise<{ success: boolean; data?: User; errors?: ValidationError | ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Update the local user data
        if (data.data && data.data.user) {
          this.user = data.data.user;
          localStorage.setItem('auth_user', JSON.stringify(this.user));
        }
        return { success: true, data: data.data?.user };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Profile update error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  async getSubscription(): Promise<{ success: boolean; data?: SubscriptionData; errors?: ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/subscription/show`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Subscription fetch error:', error);
      return { 
        success: false, 
        errors: { success: false, message: 'Bağlantı hatası oluştu' } 
      };
    }
  }

  async renewSubscription(): Promise<{ success: boolean; errors?: ApiError }> {
    try {
      const response = await fetch(`${API_BASE_URL}/subscriptions/renew`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.token}`,
          'ngrok-skip-browser-warning': 'true',
        },
      });

      const data = await response.json();

      if (response.ok && data.success) {
        return { success: true };
      } else {
        return { success: false, errors: data };
      }
    } catch (error) {
      console.error('Subscription renewal error:', error);
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
