
const API_BASE_URL = 'http://localhost:8000/api';

export interface TreeNode {
  id: number;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  url?: string;
  color?: string;
  children?: TreeNode[];
}

// Get auth token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const fileService = {
  // Get complete file tree structure
  getFileTree: async (): Promise<{ success: boolean; data?: TreeNode[]; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/myfiles/tree`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya yapısı alınamadı');
      }

      return result;
    } catch (error) {
      console.error('Error fetching file tree:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Create file
  createFile: async (data: {
    name: string;
    folder_id?: number;
    content?: string;
    type?: string;
    color?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya oluşturulamadı');
      }

      return result;
    } catch (error) {
      console.error('Error creating file:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Update file
  updateFile: async (id: number, data: {
    name?: string;
    folder_id?: number;
    content?: string;
    color?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya güncellenemedi');
      }

      return result;
    } catch (error) {
      console.error('Error updating file:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Delete file
  deleteFile: async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya silinemedi');
      }

      return result;
    } catch (error) {
      console.error('Error deleting file:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },
};

// Folder operations
export const folderService = {
  // Create folder
  createFolder: async (data: {
    name: string;
    parent_id?: number;
    color?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasör oluşturulamadı');
      }

      return result;
    } catch (error) {
      console.error('Error creating folder:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Update folder
  updateFolder: async (id: number, data: {
    name?: string;
    parent_id?: number;
    color?: string;
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasör güncellenemedi');
      }

      return result;
    } catch (error) {
      console.error('Error updating folder:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Delete folder
  deleteFolder: async (id: number): Promise<{ success: boolean; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasör silinemedi');
      }

      return result;
    } catch (error) {
      console.error('Error deleting folder:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },
};
