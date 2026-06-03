import { API_BASE_URL, apiAxios } from './index';

export const completeOnboarding = async (formData) => {
  return apiAxios('/api/onboarding/save', {
    method: 'POST',
    data: formData
  });
};

// Test authentication status
export const checkAuthStatus = async () => {
  return apiAxios('/auth/session', {
    method: 'GET'
  });
};

// Get user profile
export const getUserProfile = async () => {
  return apiAxios('/api/user/profile', {
    method: 'GET'
  });
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  return apiAxios('/api/user/profile', {
    method: 'PUT',
    data: profileData
  });
};
