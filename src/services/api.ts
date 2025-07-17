// Use environment variable or fallback to localhost
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

// Check if we're in demo mode (when backend is not available)
const IS_DEMO_MODE = API_BASE_URL.includes('your-backend-url.herokuapp.com') ||
                     import.meta.env.VITE_DEMO_MODE === 'true';

const ACTUAL_API_URL = IS_DEMO_MODE ? 'http://localhost:3002/api' : API_BASE_URL;

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Mock data for demo mode
const MOCK_USER = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  role: 'user',
  department: 'Demo Department',
  isActive: true
};

const MOCK_STATS = {
  totalItems: 15,
  activeLoans: 3,
  pendingRequests: 2,
  overdueItems: 1,
  totalUsers: 8,
  availableItems: 12,
  popularItems: [
    { name: 'Laptop Dell XPS', count: 5 },
    { name: 'Proyektor Epson', count: 3 },
    { name: 'Kamera Canon', count: 2 }
  ]
};

class ApiService {
  private handleDemoMode<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    console.log('🎭 Demo Mode - Simulating API call:', endpoint);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate different endpoints
        if (endpoint === '/auth/login') {
          resolve({ data: { user: MOCK_USER, token: 'demo-token' } as T });
        } else if (endpoint === '/auth/register') {
          resolve({ data: { user: MOCK_USER, message: 'Registration successful' } as T });
        } else if (endpoint === '/dashboard/stats') {
          resolve({ data: MOCK_STATS as T });
        } else if (endpoint.startsWith('/items')) {
          resolve({ data: [] as T });
        } else if (endpoint.startsWith('/loans')) {
          resolve({ data: [] as T });
        } else if (endpoint.startsWith('/users')) {
          resolve({ data: [MOCK_USER] as T });
        } else {
          resolve({ data: {} as T });
        }
      }, 500); // Simulate network delay
    });
  }
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    // Handle demo mode
    if (IS_DEMO_MODE) {
      return this.handleDemoMode<T>(endpoint, options);
    }

    const url = `${ACTUAL_API_URL}${endpoint}`;
    try {
      console.log('🔄 API Request:', { url, options });

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      console.log('🔍 API Response:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        // Check if it's a user not found error
        if (response.status === 400) {
          try {
            const errorData = await response.json();
            if (errorData.error && errorData.error.includes('User not found')) {
              console.warn('🔄 User not found - clearing auth and reloading...');
              localStorage.removeItem('user');
              localStorage.removeItem('token');
              localStorage.removeItem('isAuthenticated');
              window.location.reload();
              return { error: 'User session expired' };
            }
          } catch (e) {
            // If we can't parse the error, continue with normal error handling
          }
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ API Response Data:', data);
      return { data };
    } catch (error) {
      console.error('❌ API request failed:', error);
      console.error('❌ Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        url,
        options
      });
      return {
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  // Items API
  async getItems() {
    const response = await this.request<any[]>('/items');
    console.log('🔍 Raw response from API:', response);

    if (response.data) {
      const transformedItems = response.data.map(this.transformItem);
      console.log('🔄 Transformed items:', transformedItems);
      return { data: transformedItems };
    }

    return response; // Return error response as-is
  }

  private transformItem(item: any): any {
    const transformed = {
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
      maintenanceSchedule: item.maintenanceSchedule ? new Date(item.maintenanceSchedule) : null
    };
    console.log('🔄 Transforming item:', item.name, 'tags:', item.tags);
    return transformed;
  }

  async getItemById(id: string) {
    const response = await this.request<any>(`/items/${id}`);

    if (response.data) {
      return { data: this.transformItem(response.data) };
    }

    return response; // Return error response as-is
  }

  async createItem(item: any) {
    return this.request<any>('/items', {
      method: 'POST',
      body: JSON.stringify(item),
    });
  }

  async updateItem(id: string, item: any) {
    console.log('📤 Sending PUT request to update item:', id, item);
    return this.request<any>(`/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(item),
    });
  }

  async deleteItem(id: string) {
    return this.request<any>(`/items/${id}`, {
      method: 'DELETE',
    });
  }

  // Loans API
  async getLoans() {
    return this.request<any[]>('/loans');
  }

  async createLoan(loan: any) {
    return this.request<any>('/loans', {
      method: 'POST',
      body: JSON.stringify(loan),
    });
  }

  async approveLoan(loanId: string, approvedBy?: string) {
    return this.request<any>(`/loans/${loanId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({ approvedBy }),
    });
  }

  async rejectLoan(loanId: string) {
    return this.request<any>(`/loans/${loanId}/reject`, {
      method: 'PUT',
    });
  }

  async returnItem(loanId: string) {
    return this.request<any>(`/loans/${loanId}/return`, {
      method: 'PUT',
    });
  }

  // Categories API
  async getCategories() {
    return this.request<any[]>('/categories');
  }

  async getCategoryById(id: string) {
    return this.request<any>(`/categories/${id}`);
  }

  async createCategory(category: any) {
    return this.request<any>('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  }

  async updateCategory(id: string, category: any) {
    return this.request<any>(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  }

  async deleteCategory(id: string) {
    return this.request<any>(`/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Users API
  async getUsers() {
    return this.request<any[]>('/users');
  }

  async createUser(userData: any) {
    return this.request<any>('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async updateUser(id: string, userData: any) {
    return this.request<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: string) {
    return this.request<any>(`/users/${id}`, {
      method: 'DELETE',
    });
  }

  async login(email: string, password: string) {
    return this.request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData: any) {
    return this.request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Health check
  async healthCheck() {
    try {
      const url = 'http://localhost:3001/health';
      const response = await fetch(url);
      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Health check failed' };
    }
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<ApiResponse<any>> {
    return this.request('/dashboard/stats');
  }

  // Recent Activity
  async getRecentActivity(): Promise<ApiResponse<any>> {
    return this.request('/dashboard/recent-activity');
  }
}

export const apiService = new ApiService();
export default apiService;
