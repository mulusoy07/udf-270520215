
const API_BASE_URL = 'http://localhost:8000/api';

export interface TreeItem {
  id: number;
  name: string;
  type: 'folder' | 'project' | 'contract' | 'report' | 'document';
  parent_id?: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  children?: TreeItem[];
}

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const treeService = {
  // Get tree structure for sidebar
  getTreeStructure: async (): Promise<{ success: boolean; data?: TreeItem[]; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tree`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Tree yapısı alınamadı');
      }

      return result;
    } catch (error) {
      console.error('Error fetching tree structure:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Create tree item
  createTreeItem: async (data: {
    name: string;
    type: TreeItem['type'];
    parent_id?: number;
  }): Promise<{ success: boolean; data?: TreeItem; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tree`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Tree öğesi oluşturulamadı');
      }

      return result;
    } catch (error) {
      console.error('Error creating tree item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Update tree item
  updateTreeItem: async (id: number, data: {
    name?: string;
    parent_id?: number;
  }): Promise<{ success: boolean; data?: TreeItem; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tree/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Tree öğesi güncellenemedi');
      }

      return result;
    } catch (error) {
      console.error('Error updating tree item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Delete tree item
  deleteTreeItem: async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tree/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Tree öğesi silinemedi');
      }

      return result;
    } catch (error) {
      console.error('Error deleting tree item:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },
};
