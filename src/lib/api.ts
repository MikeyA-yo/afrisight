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
export interface ApiResponse {
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
  age?: number;
  bio?: string;
}

export interface ProfileResponse extends ApiResponse {
  profile: UserProfile;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  creatorType?: string;
  age?: number;
  bio?: string;
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
    events: Event[];
    count: number;
    source: string;
    scrapedAt: string;
  };
}

// Statistics API types
export interface QuickStatsResponse extends ApiResponse {
  overview: {
    totalDataPoints: number;
    concertPrograms: number;
    spotifyAfroTracks: number;
    spotifyYouTubeTracks: number;
  };
  topPerformers: {
    totalViewsTop10: string;
    averagePopularityTop10: number;
    uniqueAfroArtistsTop10: number;
    uniqueYouTubeArtistsTop10: number;
  };
  readyForPrediction: {
    dataLoaded: boolean;
    aiReady: boolean;
    suggestedAnalysisLimit: number;
    recommendedEndpoints: string[];
  };
}

// Chat API types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatRequest {
  prompt: string;
  sessionId?: string;
}

export interface ChatResponse extends ApiResponse {
  sessionId: string;
  message: string;
  conversation: {
    messageCount: number;
    sessionStarted: string;
    lastActivity: string;
  };
  context: {
    dataPointsAvailable: number;
    topArtistsReferenced: string[];
  };
  suggestions: string[];
}

export interface ChatHistoryResponse extends ApiResponse {
  sessionId?: string;
  messages?: ChatMessage[];
  sessionInfo?: {
    messageCount: number;
    createdAt: string;
    lastActivity: string;
  };
  sessions?: {
    sessionId: string;
    messageCount: number;
    lastMessage: string;
    createdAt: string;
    lastActivity: string;
  }[];
}

// Explore Creators API types
export interface Creator {
  _id: string;
  name: string;
  email: string;
  creatorType: string;
  age?: number;
  bio?: string;
}

export interface CreatorSearchResponse extends ApiResponse {
  data: {
    creators: Creator[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalCount: number;
      limit: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
    filters: {
      creatorType?: string;
      name?: string;
    };
  };
}

export interface CreatorStatsResponse extends ApiResponse {
  data: {
    totalCreators: number;
    byType: {
      creatorType: string;
      count: number;
      percentage: number;
    }[];
  };
}

export interface CreatorSearchParams {
  limit?: number;
  page?: number;
  creatorType?: string;
  name?: string;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Return hardcoded Luma events data
      return {
        success: true,
        data: {
          events: JSON.parse(` [
      {
        "name": "Make with Notion Watch Party Lagos",
        "price": "Check Event Page",
        "location": "The Ozone e-centre tsboi",
        "imageUrl": "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=80,height=80/event-covers/9f/5244857a-7ee7-4329-a642-12dea86e68a8.png",
        "eventUrl": "https://luma.com/2g9ag3a1",
        "date": "",
        "source": "luma"
      },
      {
        "name": "Venture Stack 3.0",
        "price": "Check Event Page",
        "location": "British Council",
        "imageUrl": "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=80,height=80/event-covers/1a/38d8b9e3-23cc-47e8-8274-1bef03977f74.png",
        "eventUrl": "https://luma.com/2bqhiqk5",
        "date": "",
        "source": "luma"
      },
      {
        "name": "ProductDive Lagos",
        "price": "Check Event Page",
        "location": "Lagos Mainland",
        "imageUrl": "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=80,height=80/event-covers/8h/a0318972-d0aa-4a5b-8693-447cbbd0352b.jpg",
        "eventUrl": "https://luma.com/ktbptnk2",
        "date": "",
        "source": "luma"
      },
      {
        "name": "Find Your Voice - Lagos",
        "price": "Check Event Page",
        "location": "Pistis Conference Centre",
        "imageUrl": "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=80,height=80/event-covers/81/079c1646-444a-4aa1-aa78-7dfd8395114d.png",
        "eventUrl": "https://luma.com/3mdngua8",
        "date": "",
        "source": "luma"
      },
      {
        "name": "Perfecting Storytelling With Data",
        "price": "Check Event Page",
        "location": "369 Borno Way",
        "imageUrl": "https://images.lumacdn.com/cdn-cgi/image/format=auto,fit=cover,dpr=2,anim=false,background=white,quality=75,width=80,height=80/event-covers/84/6f8c71ca-0a34-4fda-9669-f05b66a9d76f.png",
        "eventUrl": "https://luma.com/zfc53dks",
        "date": "",
        "source": "luma"
      }
    ]`),
          count: 6,
          source: "luma.com",
          scrapedAt: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Scrape events error:', error);
      throw new Error('Failed to fetch events. Please try again.');
    }
  },
};

// Statistics API functions
export const statsApi = {
  async getQuickStats(): Promise<QuickStatsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/predict/quick-stats`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch statistics');
      }

      return data;
    } catch (error) {
      console.error('Get quick stats error:', error);
      throw error;
    }
  },
};

// Chat API functions
export const chatApi = {
  async sendMessage(request: ChatRequest): Promise<ChatResponse> {
    try {
      const response = await fetch(`${BASE_URL}/predict/chat`, {
        method: 'POST',
        headers: createAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      return data;
    } catch (error) {
      console.error('Send chat message error:', error);
      throw error;
    }
  },

  async getChatHistory(sessionId?: string, limit?: number): Promise<ChatHistoryResponse> {
    try {
      const params = new URLSearchParams();
      if (sessionId) params.append('sessionId', sessionId);
      if (limit) params.append('limit', limit.toString());

      const response = await fetch(`${BASE_URL}/predict/chat/history?${params.toString()}`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch chat history');
      }

      return data;
    } catch (error) {
      console.error('Get chat history error:', error);
      throw error;
    }
  },

  async deleteSession(sessionId: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/predict/chat/session`, {
        method: 'DELETE',
        headers: createAuthHeaders(),
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete session');
      }

      return data;
    } catch (error) {
      console.error('Delete chat session error:', error);
      throw error;
    }
  },
};

// Explore Creators API functions
export const exploreApi = {
  async searchCreators(params: CreatorSearchParams = {}): Promise<CreatorSearchResponse> {
    try {
      const searchParams = new URLSearchParams();
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.page) searchParams.append('page', params.page.toString());
      if (params.creatorType) searchParams.append('creatorType', params.creatorType);
      if (params.name) searchParams.append('name', params.name);

      const response = await fetch(`${BASE_URL}/explore/creators?${searchParams.toString()}`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to search creators');
      }

      return data;
    } catch (error) {
      console.error('Search creators error:', error);
      throw error;
    }
  },

  async getCreatorStats(): Promise<CreatorStatsResponse> {
    try {
      const response = await fetch(`${BASE_URL}/explore/creator-stats`, {
        method: 'GET',
        headers: createAuthHeaders(),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch creator statistics');
      }

      return data;
    } catch (error) {
      console.error('Get creator stats error:', error);
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

  async signup(email: string, password: string, creatorType: string, name: string): Promise<ApiResponse> {
    try {
      const response = await fetch(`${BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, creatorType, name }),
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