const BASE_URL = "https://afrisight-backend.onrender.com";

// Get JWT token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('afrisight_token');
};

// Create headers with authentication
const createAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  message?: string;
  [key: string]: any;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  creatorType: string;
}

export interface ProfileResponse extends ApiResponse {
  profile: UserProfile;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  creatorType?: string;
}

export interface UpdateProfileResponse extends ApiResponse {
  profile: UserProfile;
  updatedFields: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountRequest {
  password: string;
  confirmDeletion: string;
}

// Events API types
export interface Event {
  name: string;
  price: string;
  location: string;
  imageUrl: string;
  eventUrl: string;
  date: string;
  source: 'tix' | 'luma';
}

export interface EventsResponse extends ApiResponse {
  data: {
    tixEvents: Event[];
    lumaEvents: Event[];
    totalEvents: number;
    combinedEvents: Event[];
  };
  summary: {
    tixEventsCount: number;
    lumaEventsCount: number;
    totalEventsCount: number;
    scrapedAt: string;
  };
}

// Settings API functions
export const settingsApi = {
  // Get user profile
  async getProfile(): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${BASE_URL}/settings/profile`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch profile');
      }

      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  // Update user profile
  async updateProfile(updates: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    try {
      const response = await fetch(`${BASE_URL}/settings/profile`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/settings/password`, {
        method: 'PUT',
        headers: createAuthHeaders(),
        body: JSON.stringify(passwordData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password');
      }

      return data;
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  // Delete account
  async deleteAccount(deleteData: DeleteAccountRequest): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/settings/account`, {
        method: 'DELETE',
        headers: createAuthHeaders(),
        body: JSON.stringify(deleteData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete account');
      }

      // Clear token on successful account deletion
      localStorage.removeItem('afrisight_token');

      return data;
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  },
};

// Events API functions
export const eventsApi = {
  async scrapeEvents(): Promise<EventsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/events/scrape`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape events');
      }

      return data;
    } catch (error) {
      console.error('Scrape events error:', error);
      throw error;
    }
  },
};

// Authentication API functions
export const authApi = {
  async login(email: string, password: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Store token on successful login
      if (data.token) {
        localStorage.setItem('afrisight_token', data.token);
      }

      // Ensure we return a success property
      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async signup(email: string, password: string, creatorType: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, creatorType }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      // Store token on successful signup
      if (data.token) {
        localStorage.setItem('afrisight_token', data.token);
      }

      // Ensure we return a success property
      return {
        success: true,
        ...data
      };
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem('afrisight_token');
  },

  isAuthenticated(): boolean {
    return !!getAuthToken();
  }
};