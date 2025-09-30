const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true';

// Types
export interface User {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'user' | 'admin';
}

export interface Item {
  id: string;
  name: string;
  description?: string;
  category: string;
  status: 'available' | 'borrowed' | 'maintenance';
  created_at?: string;
}

export interface LoanRequest {
  id: string;
  user_id: string;
  item_id: string;
  status: 'pending' | 'approved' | 'rejected' | 'returned';
  requested_at?: string;
  approved_at?: string;
  returned_at?: string;
}

// Demo data for when API is not available
const demoUsers: User[] = [
  { id: '1', username: 'admin', email: 'admin@example.com', role: 'admin' },
  { id: '2', username: 'user1', email: 'user1@example.com', role: 'user' },
];

const demoItems: Item[] = [
  { id: '1', name: 'Laptop Dell', description: 'Dell Latitude 7420', category: 'Electronics', status: 'available' },
  { id: '2', name: 'Projector', description: 'Epson EB-X41', category: 'Electronics', status: 'borrowed' },
  { id: '3', name: 'Whiteboard', description: 'Standard whiteboard', category: 'Office', status: 'available' },
];

const demoLoans: LoanRequest[] = [
  { id: '1', user_id: '2', item_id: '2', status: 'approved' },
];

// Utility function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text();
};

// API functions
export const api = {
  // Auth
  async login(credentials: LoginRequest): Promise<{ user: User; token: string }> {
    if (DEMO_MODE) {
      const user = demoUsers.find(u => u.username === credentials.username);
      if (!user || credentials.password !== 'password') {
        throw new Error('Invalid credentials');
      }
      return { user, token: 'demo-token-' + user.id };
    }

    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    
    return handleResponse(response);
  },

  async register(userData: RegisterRequest): Promise<{ user: User; token: string }> {
    if (DEMO_MODE) {
      const newUser: User = {
        id: String(demoUsers.length + 1),
        username: userData.username,
        email: userData.email,
        role: userData.role || 'user',
      };
      demoUsers.push(newUser);
      return { user: newUser, token: 'demo-token-' + newUser.id };
    }

    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    return handleResponse(response);
  },

  async getCurrentUser(token: string): Promise<User> {
    if (DEMO_MODE) {
      const userId = token.replace('demo-token-', '');
      const user = demoUsers.find(u => u.id === userId);
      if (!user) throw new Error('User not found');
      return user;
    }

    const response = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return handleResponse(response);
  },

  // Items
  async getItems(): Promise<Item[]> {
    if (DEMO_MODE) {
      return demoItems;
    }

    const response = await fetch(`${API_URL}/items`);
    return handleResponse(response);
  },

  async createItem(item: Omit<Item, 'id'>): Promise<Item> {
    if (DEMO_MODE) {
      const newItem: Item = {
        ...item,
        id: String(demoItems.length + 1),
      };
      demoItems.push(newItem);
      return newItem;
    }

    const response = await fetch(`${API_URL}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    
    return handleResponse(response);
  },

  async updateItem(id: string, updates: Partial<Item>): Promise<Item> {
    if (DEMO_MODE) {
      const itemIndex = demoItems.findIndex(i => i.id === id);
      if (itemIndex === -1) throw new Error('Item not found');
      
      demoItems[itemIndex] = { ...demoItems[itemIndex], ...updates };
      return demoItems[itemIndex];
    }

    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    return handleResponse(response);
  },

  async deleteItem(id: string): Promise<void> {
    if (DEMO_MODE) {
      const itemIndex = demoItems.findIndex(i => i.id === id);
      if (itemIndex === -1) throw new Error('Item not found');
      demoItems.splice(itemIndex, 1);
      return;
    }

    const response = await fetch(`${API_URL}/items/${id}`, {
      method: 'DELETE',
    });
    
    await handleResponse(response);
  },

  // Loan Requests
  async getLoanRequests(): Promise<LoanRequest[]> {
    if (DEMO_MODE) {
      return demoLoans;
    }

    const response = await fetch(`${API_URL}/loans`);
    return handleResponse(response);
  },

  async createLoanRequest(itemId: string): Promise<LoanRequest> {
    if (DEMO_MODE) {
      const newLoan: LoanRequest = {
        id: String(demoLoans.length + 1),
        user_id: '2', // Current demo user
        item_id: itemId,
        status: 'pending',
      };
      demoLoans.push(newLoan);
      return newLoan;
    }

    const response = await fetch(`${API_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ item_id: itemId }),
    });
    
    return handleResponse(response);
  },

  async updateLoanRequest(id: string, status: LoanRequest['status']): Promise<LoanRequest> {
    if (DEMO_MODE) {
      const loanIndex = demoLoans.findIndex(l => l.id === id);
      if (loanIndex === -1) throw new Error('Loan request not found');
      
      demoLoans[loanIndex] = { ...demoLoans[loanIndex], status };
      return demoLoans[loanIndex];
    }

    const response = await fetch(`${API_URL}/loans/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    
    return handleResponse(response);
  },

  // Users (Admin only)
  async getUsers(): Promise<User[]> {
    if (DEMO_MODE) {
      return demoUsers;
    }

    const response = await fetch(`${API_URL}/users`);
    return handleResponse(response);
  },

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    if (DEMO_MODE) {
      const userIndex = demoUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      
      demoUsers[userIndex] = { ...demoUsers[userIndex], ...updates };
      return demoUsers[userIndex];
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    
    return handleResponse(response);
  },

  async deleteUser(id: string): Promise<void> {
    if (DEMO_MODE) {
      const userIndex = demoUsers.findIndex(u => u.id === id);
      if (userIndex === -1) throw new Error('User not found');
      demoUsers.splice(userIndex, 1);
      return;
    }

    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
    });
    
    await handleResponse(response);
  },
};

export default api;
