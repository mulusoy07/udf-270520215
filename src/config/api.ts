
// API configuration
export const API_CONFIG = {
  BASE_URL: 'https://a998-46-1-181-143.ngrok-free.app/api',
  SESSION_CHECK_INTERVAL: 300000, // 5 dakika (milisaniye cinsinden)
  TIMEOUT: 10000, // 10 saniye
} as const;

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('auth_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
    'ngrok-skip-browser-warning': 'true',
  };
};

// Helper function to handle unauthorized responses
export const handleUnauthorizedResponse = (response: Response) => {
  if (response.status === 401 || response.statusText === 'Unauthorized') {
    // Clear auth data and redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    window.location.href = '/login';
    return true;
  }
  return false;
};
