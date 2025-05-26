
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:8000/api';

export interface MediaFile {
  id: number;
  name: string;
  type: string;
  size: number;
  content?: string;
  folder_id?: number;
  folder?: MediaFolder;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface MediaFolder {
  id: number;
  name: string;
  user_id: number;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  children?: MediaFolder[];
  files?: MediaFile[];
}

// Get auth token from context
const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// File operations
export const fileService = {
  // Get all files
  getFiles: async (): Promise<{ success: boolean; data?: MediaFile[]; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosyalar alınamadı');
      }

      return result;
    } catch (error) {
      console.error('Error fetching files:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Get single file
  getFile: async (id: number): Promise<{ success: boolean; data?: MediaFile; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${id}`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya alınamadı');
      }

      return result;
    } catch (error) {
      console.error('Error fetching file:', error);
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
  }): Promise<{ success: boolean; data?: MediaFile; message?: string }> => {
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
  }): Promise<{ success: boolean; data?: MediaFile; message?: string }> => {
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
  // Get all folders
  getFolders: async (): Promise<{ success: boolean; data?: MediaFolder[]; message?: string }> => {
    try {
      const response = await fetch(`${API_BASE_URL}/folders`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasörler alınamadı');
      }

      return result;
    } catch (error) {
      console.error('Error fetching folders:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Bilinmeyen hata oluştu'
      };
    }
  },

  // Create folder
  createFolder: async (data: {
    name: string;
    parent_id?: number;
  }): Promise<{ success: boolean; data?: MediaFolder; message?: string }> => {
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
  }): Promise<{ success: boolean; data?: MediaFolder; message?: string }> => {
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
