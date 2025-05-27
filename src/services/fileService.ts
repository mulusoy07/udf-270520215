
import { API_CONFIG, getAuthHeaders, handleUnauthorizedResponse } from '@/config/api';

export interface TreeNode {
  id: number;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  url?: string;
  color?: string;
  children?: TreeNode[];
  created_at?: string;
  updated_at?: string;
  upload_at?: string;
}

// Cache sistemi için global state
let fileTreeCache: TreeNode[] | null = null;
let cacheListeners: Array<(tree: TreeNode[]) => void> = [];

// Cache listener ekleme
export const addCacheListener = (listener: (tree: TreeNode[]) => void) => {
  cacheListeners.push(listener);
};

// Cache listener kaldırma
export const removeCacheListener = (listener: (tree: TreeNode[]) => void) => {
  cacheListeners = cacheListeners.filter(l => l !== listener);
};

// Cache'i güncelle ve listeners'ları bilgilendir
const updateCache = (newTree: TreeNode[]) => {
  fileTreeCache = newTree;
  cacheListeners.forEach(listener => listener(newTree));
};

// Cache'de item bulma helper'ı
const findItemInTree = (tree: TreeNode[], id: number): { item: TreeNode; parent: TreeNode | null; index: number } | null => {
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i];
    if (item.id === id) {
      return { item, parent: null, index: i };
    }
    if (item.children) {
      const found = findItemInTree(item.children, id);
      if (found) {
        return { item: found.item, parent: item, index: found.index };
      }
    }
  }
  return null;
};

// Cache'de item güncelleme
const updateItemInCache = (id: number, updates: Partial<TreeNode>) => {
  if (!fileTreeCache) return;
  
  const found = findItemInTree(fileTreeCache, id);
  if (found) {
    Object.assign(found.item, updates);
    updateCache([...fileTreeCache]);
  }
};

// Cache'den item silme
const removeItemFromCache = (id: number) => {
  if (!fileTreeCache) return;
  
  const found = findItemInTree(fileTreeCache, id);
  if (found) {
    if (found.parent) {
      found.parent.children = found.parent.children?.filter(child => child.id !== id);
    } else {
      fileTreeCache = fileTreeCache.filter(item => item.id !== id);
    }
    updateCache([...fileTreeCache]);
  }
};

// Cache'e item ekleme
const addItemToCache = (item: TreeNode, parentId?: number) => {
  if (!fileTreeCache) return;
  
  if (parentId) {
    const found = findItemInTree(fileTreeCache, parentId);
    if (found && found.item.type === 'folder') {
      if (!found.item.children) {
        found.item.children = [];
      }
      found.item.children.push(item);
      updateCache([...fileTreeCache]);
    }
  } else {
    fileTreeCache.push(item);
    updateCache([...fileTreeCache]);
  }
};

// Cache'de item taşıma (sürükle-bırak için)
const moveItemInCache = (itemId: number, targetFolderId: number) => {
  if (!fileTreeCache) return false;
  
  // Taşınacak item'ı bul ve eski yerinden çıkar
  const itemFound = findItemInTree(fileTreeCache, itemId);
  if (!itemFound) return false;
  
  const itemToMove = { ...itemFound.item };
  
  // Eski yerinden çıkar
  if (itemFound.parent) {
    itemFound.parent.children = itemFound.parent.children?.filter(child => child.id !== itemId);
  } else {
    fileTreeCache = fileTreeCache.filter(item => item.id !== itemId);
  }
  
  // Yeni yerine ekle
  const targetFound = findItemInTree(fileTreeCache, targetFolderId);
  if (targetFound && targetFound.item.type === 'folder') {
    if (!targetFound.item.children) {
      targetFound.item.children = [];
    }
    targetFound.item.children.push(itemToMove);
    updateCache([...fileTreeCache]);
    return true;
  }
  
  return false;
};

export const fileService = {
  // Get complete file tree structure
  getFileTree: async (useCache: boolean = true): Promise<{ success: boolean; data?: TreeNode[]; message?: string }> => {
    // Cache varsa ve useCache true ise cache'den dön
    if (useCache && fileTreeCache) {
      return {
        success: true,
        data: fileTreeCache
      };
    }

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/myfiles/tree`, {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya yapısı alınamadı');
      }

      // Cache'i güncelle
      if (result.success && result.data) {
        updateCache(result.data);
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
    type: string;
    color?: string;
    mime_type?: string;
    size?: number;
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const requestData = {
        name: data.name,
        folder_id: data.folder_id,
        type: 'file', // API için type her zaman 'file' olacak
        mime_type: data.mime_type || 'text/plain', // Default mime type
        size: data.size || 0, // Default size
        color: data.color
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/files`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya oluşturulamadı');
      }

      // Cache'e yeni dosyayı ekle
      if (result.success && result.data) {
        const newFile: TreeNode = {
          id: result.data.id,
          name: result.data.name,
          type: 'file',
          color: result.data.color,
          size: result.data.size,
          created_at: result.data.created_at,
          updated_at: result.data.updated_at,
          upload_at: result.data.upload_at
        };
        addItemToCache(newFile, data.folder_id);
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
    color?: string;
    mime_type?: string;
    size?: number;
  }): Promise<{ success: boolean; data?: any; message?: string }> => {
    try {
      const requestData = {
        name: data.name,
        folder_id: data.folder_id,
        color: data.color,
        mime_type: data.mime_type,
        size: data.size
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/files/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya güncellenemedi');
      }

      // Cache'de dosyayı güncelle
      if (result.success) {
        updateItemInCache(id, {
          ...data,
          updated_at: result.data?.updated_at,
          upload_at: result.data?.upload_at
        });
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/files/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Dosya silinemedi');
      }

      // Cache'den dosyayı kaldır
      if (result.success) {
        removeItemFromCache(id);
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

  // Cache'i temizle
  clearCache: () => {
    fileTreeCache = null;
    updateCache([]);
  },

  // Sürükle-bırak için cache'de item taşıma
  moveItemInCache: (itemId: number, targetFolderId: number) => {
    return moveItemInCache(itemId, targetFolderId);
  }
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
      const requestData = {
        name: data.name,
        parent_id: data.parent_id,
        type: 'folder', // API için type her zaman 'folder' olacak
        color: data.color
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/folders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasör oluşturulamadı');
      }

      // Cache'e yeni klasörü ekle
      if (result.success && result.data) {
        const newFolder: TreeNode = {
          id: result.data.id,
          name: result.data.name,
          type: 'folder',
          color: result.data.color,
          children: [],
          created_at: result.data.created_at,
          updated_at: result.data.updated_at
        };
        addItemToCache(newFolder, data.parent_id);
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
      const requestData = {
        name: data.name,
        parent_id: data.parent_id,
        color: data.color
      };

      const response = await fetch(`${API_CONFIG.BASE_URL}/folders/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(requestData),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasör güncellenemedi');
      }

      // Cache'de klasörü güncelle
      if (result.success) {
        updateItemInCache(id, {
          ...data,
          updated_at: result.data?.updated_at
        });
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
      const response = await fetch(`${API_CONFIG.BASE_URL}/folders/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (handleUnauthorizedResponse(response)) {
        return {
          success: false,
          message: 'Oturum süresi doldu'
        };
      }

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.message || 'Klasör silinemedi');
      }

      // Cache'den klasörü kaldır
      if (result.success) {
        removeItemFromCache(id);
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
