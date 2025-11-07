import { AUTH_API_BASE_URL, USER_API_BASE_URL, AUTH_ENDPOINTS, USER_ENDPOINTS } from '../config/authApi';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
  profileInfo?: string;
  fitnessLevel?: string;
  goals?: string;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  userId: string;
}

export interface UserProfileDTO {
  userId: string;
  email: string;
  name: string;
  profileInfo?: string;
  fitnessLevel?: string;
  goals?: string;
  createdAt?: string;
  updatedAt?: string;
}

class AuthService {
  private authBaseUrl: string;
  private userBaseUrl: string;

  constructor() {
    this.authBaseUrl = AUTH_API_BASE_URL;
    this.userBaseUrl = USER_API_BASE_URL;
  }

  private async request<T>(
    baseUrl: string,
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      console.log(`Making request to: ${url}`);
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const errorText = await response.text();
        let error;
        try {
          error = JSON.parse(errorText);
        } catch {
          error = { error: errorText || `HTTP ${response.status}: ${response.statusText}` };
        }
        throw new Error(error.error || error.message || 'Request failed');
      }

      // Handle empty responses
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      return {} as T;
    } catch (error: any) {
      console.error(`API Error (${endpoint}):`, error);
      if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
        throw new Error(`Cannot connect to ${baseUrl}. Make sure:\n1. The service is running\n2. Both devices are on the same Wi-Fi network\n3. Your firewall allows connections`);
      }
      throw error;
    }
  }

  async login(credentials: LoginRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>(
      this.authBaseUrl,
      AUTH_ENDPOINTS.login,
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
  }

  async register(data: RegistrationRequest): Promise<TokenResponse> {
    return this.request<TokenResponse>(
      this.authBaseUrl,
      AUTH_ENDPOINTS.register,
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  async getUserProfile(userId: string, token: string): Promise<UserProfileDTO> {
    return this.request<UserProfileDTO>(
      this.userBaseUrl,
      USER_ENDPOINTS.getProfile(userId),
      {
        method: 'GET',
      },
      token
    );
  }

  async updateUserProfile(
    userId: string,
    data: Partial<UserProfileDTO>,
    token: string
  ): Promise<UserProfileDTO> {
    return this.request<UserProfileDTO>(
      this.userBaseUrl,
      USER_ENDPOINTS.updateProfile(userId),
      {
        method: 'PUT',
        body: JSON.stringify(data),
      },
      token
    );
  }
}

export const authService = new AuthService();

