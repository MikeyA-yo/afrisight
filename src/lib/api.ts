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
          events: [
            {
              name: "African Music Industry Networking",
              price: "Check Event Page",
              location: "Ikoyi, Lagos",
              imageUrl: "https://images.luma.com/music-networking.jpg",
              eventUrl: "https://luma.com/events/african-music-networking",
              date: "Next Friday at 7:00 PM",
              source: "luma"
            },
            {
              name: "Beat Making Workshop",
              price: "Check Event Page", 
              location: "Surulere, Lagos",
              imageUrl: "https://images.luma.com/beat-workshop.jpg",
              eventUrl: "https://luma.com/events/beat-making-workshop",
              date: "Dec 20, 2025 at 3:00 PM",
              source: "luma"
            },
            {
              name: "Creative Arts Festival",
              price: "₦5,000",
              location: "Victoria Island, Lagos",
              imageUrl: "https://images.luma.com/arts-festival.jpg",
              eventUrl: "https://luma.com/events/creative-arts-festival",
              date: "Oct 15, 2025 at 6:00 PM",
              source: "luma"
            },
            {
              name: "Afrobeats Producer Meetup",
              price: "Free",
              location: "Lekki, Lagos",
              imageUrl: "https://images.luma.com/afrobeats-meetup.jpg",
              eventUrl: "https://luma.com/events/afrobeats-producer-meetup",
              date: "Sep 25, 2025 at 4:00 PM",
              source: "luma"
            },
            {
              name: "Digital Content Creation Workshop",
              price: "₦8,000",
              location: "Ikeja, Lagos",
              imageUrl: "https://images.luma.com/content-workshop.jpg",
              eventUrl: "https://luma.com/events/digital-content-workshop",
              date: "Oct 5, 2025 at 2:00 PM",
              source: "luma"
            },
            {
              name: "Music Business Conference",
              price: "₦15,000",
              location: "Lagos Island, Lagos",
              imageUrl: "https://images.luma.com/music-business.jpg",
              eventUrl: "https://luma.com/events/music-business-conference",
              date: "Nov 12, 2025 at 9:00 AM",
              source: "luma"
            }
          ],
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