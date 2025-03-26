import { create } from 'zustand';

// Define the types for our store
type User = {
  id: string;
  name: string;
  email: string;
};

type FundType = {
  id: string;
  name: string;
  description: string;
  balance: number;
};

interface AppState {
  user: User | null;
  funds: FundType[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setFunds: (funds: FundType[]) => void;
  addFund: (fund: FundType) => void;
  removeFund: (fundId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

// Create the store
export const useAppStore = create<AppState>((set) => ({
  // Initial state
  user: null,
  funds: [],
  isLoading: false,
  error: null,
  
  // Actions
  setUser: (user) => set({ user }),
  setFunds: (funds) => set({ funds }),
  addFund: (fund) => set((state) => ({ funds: [...state.funds, fund] })),
  removeFund: (fundId) => set((state) => ({ 
    funds: state.funds.filter(fund => fund.id !== fundId) 
  })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
})); 