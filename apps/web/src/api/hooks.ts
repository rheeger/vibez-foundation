import { useQuery, useMutation, QueryClient } from 'react-query';
import apiClient from './client';
import { useAppStore } from '../store/useAppStore';

// Type definitions
type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  location?: string;
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
  };
};

type LoginCredentials = {
  email: string;
  password: string;
};

type RegisterData = {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

type UpdateProfileData = Partial<Omit<User, 'id'>>;

type AuthResponse = {
  user: User;
  token: string;
};

type Fund = {
  id: string;
  name: string;
  description: string;
  balance: number;
};

type Organization = {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
};

// Query keys
export const QUERY_KEYS = {
  USER: 'user',
  PROFILE: 'profile',
  FUNDS: 'funds',
  FUND: 'fund',
  ORGANIZATIONS: 'organizations',
  ORGANIZATION: 'organization',
};

// Auth functions
const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/login', credentials);
  return data;
};

const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  const { data } = await apiClient.post('/auth/register', userData);
  return data;
};

const getCurrentUser = async (): Promise<User> => {
  const { data } = await apiClient.get('/auth/me');
  return data.user;
};

const updateUserProfile = async (profileData: UpdateProfileData): Promise<User> => {
  const { data } = await apiClient.put('/user/profile', profileData);
  return data.user;
};

const updateUserPassword = async (passwordData: {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}): Promise<{ success: boolean; message: string }> => {
  const { data } = await apiClient.put('/user/password', passwordData);
  return data;
};

const uploadUserAvatar = async (formData: FormData): Promise<{ avatarUrl: string }> => {
  const { data } = await apiClient.post('/user/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
};

// Query functions
const getFunds = async (): Promise<Fund[]> => {
  const { data } = await apiClient.get('/funds');
  return data.funds;
};

const getFund = async (id: string): Promise<Fund> => {
  const { data } = await apiClient.get(`/funds/${id}`);
  return data.fund;
};

const getOrganizations = async (search?: string): Promise<Organization[]> => {
  const { data } = await apiClient.get('/organizations', {
    params: { search },
  });
  return data.organizations;
};

const getOrganization = async (id: string): Promise<Organization> => {
  const { data } = await apiClient.get(`/organizations/${id}`);
  return data.organization;
};

// Create a new fund
const createFund = async (fundData: Omit<Fund, 'id' | 'balance'>): Promise<Fund> => {
  const { data } = await apiClient.post('/funds', fundData);
  return data.fund;
};

// Donate to a fund
const donateToFund = async ({
  fundId,
  amount,
}: {
  fundId: string;
  amount: number;
}): Promise<Fund> => {
  const { data } = await apiClient.post(`/funds/${fundId}/donate`, { amount });
  return data.fund;
};

// Auth hooks
export const useLogin = () => {
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  
  return useMutation(loginUser, {
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useRegister = () => {
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  
  return useMutation(registerUser, {
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      localStorage.setItem('auth_token', data.token);
      setUser(data.user);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useGetCurrentUser = () => {
  const setUser = useAppStore((state) => state.setUser);
  
  return useQuery(QUERY_KEYS.USER, getCurrentUser, {
    onSuccess: (data) => {
      setUser(data);
    },
    onError: () => {
      // Clear user on error (token might be invalid)
      setUser(null);
      localStorage.removeItem('auth_token');
    },
    // Only run if we have a token
    enabled: !!localStorage.getItem('auth_token'),
    retry: false,
  });
};

// Profile hooks
export const useUpdateProfile = () => {
  const queryClient = new QueryClient();
  const setUser = useAppStore((state) => state.setUser);
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  
  return useMutation(updateUserProfile, {
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries(QUERY_KEYS.USER);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useUpdatePassword = () => {
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  
  return useMutation(updateUserPassword, {
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = new QueryClient();
  const setLoading = useAppStore((state) => state.setLoading);
  const setError = useAppStore((state) => state.setError);
  const setUser = useAppStore((state) => state.setUser);
  const user = useAppStore((state) => state.user);
  
  return useMutation(uploadUserAvatar, {
    onMutate: () => {
      setLoading(true);
      setError(null);
    },
    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, avatarUrl: data.avatarUrl } as User);
      }
      queryClient.invalidateQueries(QUERY_KEYS.USER);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
    onSettled: () => {
      setLoading(false);
    },
  });
};

// React Query hooks
export const useGetFunds = () => {
  const setFunds = useAppStore((state) => state.setFunds);
  const setError = useAppStore((state) => state.setError);
  
  return useQuery(QUERY_KEYS.FUNDS, getFunds, {
    onSuccess: (data) => {
      setFunds(data);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });
};

export const useGetFund = (id: string) => {
  return useQuery([QUERY_KEYS.FUND, id], () => getFund(id), {
    enabled: !!id,
  });
};

export const useGetOrganizations = (search?: string) => {
  return useQuery(
    [QUERY_KEYS.ORGANIZATIONS, search],
    () => getOrganizations(search),
    {
      enabled: true,
    }
  );
};

export const useGetOrganization = (id: string) => {
  return useQuery([QUERY_KEYS.ORGANIZATION, id], () => getOrganization(id), {
    enabled: !!id,
  });
};

export const useCreateFund = () => {
  const addFund = useAppStore((state) => state.addFund);
  
  return useMutation(createFund, {
    onSuccess: (data) => {
      addFund(data);
    },
  });
};

export const useDonateToFund = () => {
  const queryClient = new QueryClient();
  
  return useMutation(donateToFund, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(QUERY_KEYS.FUNDS);
      queryClient.invalidateQueries([QUERY_KEYS.FUND, data.id]);
    },
  });
}; 