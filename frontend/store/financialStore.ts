import { create } from 'zustand';

type FinancialData = {
  financial_data: {
    banks: any[];
    investments: any[];
    insurance: any[];
    loans: any[];
    mutualFunds?: any[];
    stocks?: any[];
    netWorth?: number;
    recentTransactions: any[];
    balanceHistory?: { month: string; desktop: number; mobile: number }[];
    investmentAllocation?: { name: string; value: number }[];
    creditScore?: { score: number; date: string }[];
  };
};

type FinancialStore = {
  financialData: FinancialData | null;
  loading: boolean;
  error: string | null;
  fetchFinancialData: (userId: string) => Promise<void>;
  setFinancialData: (data: FinancialData | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
};

export const useFinancialStore = create<FinancialStore>((set) => ({
  financialData: null,
  loading: false,
  error: null,
  
  setFinancialData: (data) => set({ financialData: data }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),
  
  fetchFinancialData: async (userId) => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch(`http://localhost:8000/financial-data/${userId}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch financial data: ${response.status}`);
      }

      const data = await response.json();
      
      set({ 
        financialData: data, 
        loading: false 
      });
    } catch (error: any) {
      set({ 
        error: error.message || 'Failed to fetch financial data', 
        loading: false 
      });
      throw error;
    }
  },
}));