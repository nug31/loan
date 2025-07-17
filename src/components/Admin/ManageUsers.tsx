import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit, Trash2, Shield, User, Mail, Phone, Building, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { User as UserType } from '../../types';
import { exportUsersData } from '../../utils/exportUtils';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';

// Transform API user data to match frontend UserType
const transformApiUser = (apiUser: any): UserType => {
  try {
    console.log('🔄 Transforming API user:', apiUser);

    // Handle both API formats: name field or firstName/lastName fields
    const fullName = apiUser.name || `${apiUser.firstName || ''} ${apiUser.lastName || ''}`.trim();
    const [firstName, ...lastNameParts] = fullName.split(' ');
    const lastName = lastNameParts.join(' ');

    const transformed = {
      id: apiUser.id,
      email: apiUser.email,
      firstName: firstName || '',
      lastName: lastName || '',
      role: apiUser.role,
      createdAt: new Date(apiUser.createdAt),
      isActive: apiUser.isActive,
      department: apiUser.department || '',
      phoneNumber: apiUser.phone || apiUser.phoneNumber || ''
    };

    console.log('✅ Transformed user:', transformed);
    return transformed;
  } catch (err) {
    console.error('❌ Error transforming user:', apiUser, err);
    throw err;
  }
};

export const ManageUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load users from API on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Loading users from API...');

      const response = await apiService.getUsers();
      console.log('🔍 Raw API response:', response);

      if (response.data) {
        console.log('🔍 Raw users data:', response.data);
        const transformedUsers = response.data.map((user: any) => {
          console.log('🔄 Transforming user:', user);
          return transformApiUser(user);
        });
        console.log('✅ Users loaded:', transformedUsers.length, 'users');
        console.log('🔍 Transformed users:', transformedUsers);
        setUsers(transformedUsers);
      } else {
        console.error('❌ Failed to load users:', response.error);
        setError(response.error || 'Failed to load users');

        // Fallback: show empty state instead of error for better UX
        setUsers([]);
      }
    } catch (err) {
      console.error('❌ Error loading users:', err);
      console.error('❌ Error details:', err);
      setError(`Failed to load users: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    role: 'user' as 'admin' | 'user',
    isActive: true
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      department: '',
      role: 'user',
      isActive: true
    });
  };

  // Security helper functions
  const isCurrentUser = (userId: string) => currentUser?.id === userId;

  const getAdminCount = () => users.filter(user => user.role === 'admin' && user.isActive).length;

  const canDeleteUser = (user: UserType) => {
    // Can't delete yourself
    if (isCurrentUser(user.id)) return false;

    // Can't delete the last active admin
    if (user.role === 'admin' && user.isActive && getAdminCount() <= 1) return false;

    return true;
  };

  const canChangeRole = (user: UserType, newRole: string) => {
    // Can't change your own role
    if (isCurrentUser(user.id)) return false;

    // Can't demote the last active admin
    if (user.role === 'admin' && newRole === 'user' && user.isActive && getAdminCount() <= 1) return false;

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // Check if role change is allowed
        if (editingUser.role !== formData.role && !canChangeRole(editingUser, formData.role)) {
          alert('Cannot change role: You cannot change your own role or demote the last active administrator.');
          return;
        }

        console.log('🔄 Updating user:', editingUser.id);
        // Transform frontend data to API format
        const apiData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phoneNumber,
          department: formData.department,
          role: formData.role,
          isActive: formData.isActive
        };
        const response = await apiService.updateUser(editingUser.id, apiData);

        if (response.data) {
          console.log('✅ User updated successfully');
          await loadUsers(); // Reload users from API
          setEditingUser(null);
        } else {
          console.error('❌ Failed to update user:', response.error);
          alert('Failed to update user: ' + (response.error || 'Unknown error'));
          return;
        }
      } else {
        console.log('🔄 Creating new user');
        // Transform frontend data to API format
        const apiData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: formData.phoneNumber,
          department: formData.department,
          role: formData.role,
          isActive: formData.isActive,
          password: 'defaultPassword123' // In production, this should be handled properly
        };
        const response = await apiService.createUser(apiData);

        if (response.data) {
          console.log('✅ User created successfully');
          await loadUsers(); // Reload users from API
        } else {
          console.error('❌ Failed to create user:', response.error);
          alert('Failed to create user: ' + (response.error || 'Unknown error'));
          return;
        }
      }

      resetForm();
      setShowAddModal(false);
    } catch (err) {
      console.error('❌ Error submitting user:', err);
      alert('An error occurred while saving the user');
    }
  };

  const handleEdit = (user: UserType) => {
    setEditingUser(user);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber || '',
      department: user.department || '',
      role: user.role,
      isActive: user.isActive
    });
    setShowAddModal(true);
  };

  const handleDelete = (user: UserType) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      if (!canDeleteUser(userToDelete)) {
        alert('Cannot delete user: You cannot delete yourself or the last active administrator.');
        setShowDeleteModal(false);
        setUserToDelete(null);
        return;
      }

      try {
        console.log('🔄 Deleting user:', userToDelete.id);
        const response = await apiService.deleteUser(userToDelete.id);

        if (response.data || response.message) {
          console.log('✅ User deleted successfully');
          await loadUsers(); // Reload users from API
        } else {
          console.error('❌ Failed to delete user:', response.error);
          alert('Failed to delete user: ' + (response.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('❌ Error deleting user:', err);
        alert('An error occurred while deleting the user');
      }

      setUserToDelete(null);
      setShowDeleteModal(false);
    }
  };

  const toggleUserStatus = async (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    // Can't deactivate yourself
    if (isCurrentUser(userId)) {
      alert('Cannot change your own status.');
      return;
    }

    // Can't deactivate the last active admin
    if (user.role === 'admin' && user.isActive && getAdminCount() <= 1) {
      alert('Cannot deactivate the last active administrator.');
      return;
    }

    try {
      console.log('🔄 Toggling user status:', userId);
      // Transform frontend data to API format
      const apiData = {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        phone: user.phoneNumber,
        department: user.department,
        role: user.role,
        isActive: !user.isActive
      };
      const response = await apiService.updateUser(userId, apiData);

      if (response.data) {
        console.log('✅ User status updated successfully');
        await loadUsers(); // Reload users from API
      } else {
        console.error('❌ Failed to update user status:', response.error);
        alert('Failed to update user status: ' + (response.error || 'Unknown error'));
      }
    } catch (err) {
      console.error('❌ Error updating user status:', err);
      alert('An error occurred while updating user status');
    }
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    exportUsersData(filteredUsers, format);
    setShowExportMenu(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Users</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download size={20} />
              <span>Export</span>
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                <div className="p-2">
                  <button
                    onClick={() => handleExport('excel')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                  >
                    <FileSpreadsheet size={16} />
                    <span>Export to Excel</span>
                  </button>
                  <button
                    onClick={() => handleExport('pdf')}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center space-x-2"
                  >
                    <FileText size={16} />
                    <span>Export to PDF</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              resetForm();
              setEditingUser(null);
              setShowAddModal(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>Add User</span>
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading users...</span>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                Error loading users: {error}
              </p>
              <button
                onClick={loadUsers}
                className="mt-2 text-sm text-red-600 hover:text-red-500 underline"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <User className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Users</p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <User className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Administrators</p>
              <p className="text-2xl font-bold text-purple-600">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Shield className="text-purple-600" size={24} />
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Search and Filters */}
      {!loading && !error && (
      <>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Users</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Mail size={14} className="mr-1" />
                      {user.email}
                    </div>
                    {user.phoneNumber && (
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone size={14} className="mr-1" />
                        {user.phoneNumber}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center">
                      <Building size={14} className="mr-1" />
                      {user.department || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 w-fit ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 text-purple-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? <Shield size={12} /> : <User size={12} />}
                      <span className="capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleUserStatus(user.id)}
                      disabled={isCurrentUser(user.id) || (user.role === 'admin' && user.isActive && getAdminCount() <= 1)}
                      className={`px-2 py-1 rounded-full text-xs font-medium transition-colors ${
                        isCurrentUser(user.id) || (user.role === 'admin' && user.isActive && getAdminCount() <= 1)
                          ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                          : user.isActive
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                      title={
                        isCurrentUser(user.id)
                          ? 'Cannot change your own status'
                          : (user.role === 'admin' && user.isActive && getAdminCount() <= 1)
                            ? 'Cannot deactivate the last active administrator'
                            : `Click to ${user.isActive ? 'deactivate' : 'activate'} user`
                      }
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.createdAt.toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className={`p-1 transition-colors ${
                          isCurrentUser(user.id)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-yellow-600'
                        }`}
                        title={isCurrentUser(user.id) ? 'Cannot edit your own account' : 'Edit user'}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        disabled={!canDeleteUser(user)}
                        className={`p-1 transition-colors ${
                          !canDeleteUser(user)
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-400 hover:text-red-600'
                        }`}
                        title={
                          !canDeleteUser(user)
                            ? isCurrentUser(user.id)
                              ? 'Cannot delete your own account'
                              : 'Cannot delete the last active administrator'
                            : 'Delete user'
                        }
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingUser ? 'Edit User' : 'Add New User'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department
                  </label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                    {editingUser && isCurrentUser(editingUser.id) && (
                      <span className="text-xs text-gray-500 ml-2">(Cannot change your own role)</span>
                    )}
                    {editingUser && editingUser.role === 'admin' && editingUser.isActive && getAdminCount() <= 1 && (
                      <span className="text-xs text-gray-500 ml-2">(Last active admin)</span>
                    )}
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
                    disabled={editingUser && !canChangeRole(editingUser, formData.role === 'admin' ? 'user' : 'admin')}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      editingUser && !canChangeRole(editingUser, formData.role === 'admin' ? 'user' : 'admin')
                        ? 'bg-gray-100 cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <option value="user">User</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingUser(null);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{userToDelete.firstName} {userToDelete.lastName}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};