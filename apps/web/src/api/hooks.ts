import { useQuery, useMutation, QueryClient } from 'react-query';
import apiClient from './client';
import { useAppStore } from '../store/useAppStore';

// Type definitions
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
  FUNDS: 'funds',
  FUND: 'fund',
  ORGANIZATIONS: 'organizations',
  ORGANIZATION: 'organization',
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