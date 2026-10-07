import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as customerAuthService from '../services/customerAuthService';

const CustomerAuthContext = createContext(null);

function persist(token, customer) {
  localStorage.setItem('kundali_customer_token', token);
  localStorage.setItem('kundali_customer_user', JSON.stringify(customer));
}

export function CustomerAuthProvider({ children }) {
  const [customer, setCustomer] = useState(() => {
    try {
      const stored = localStorage.getItem('kundali_customer_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const signup = useCallback(async (payload) => {
    const { token, customer: newCustomer } = await customerAuthService.signup(payload);
    persist(token, newCustomer);
    setCustomer(newCustomer);
    return newCustomer;
  }, []);

  const login = useCallback(async (email, password) => {
    const { token, customer: loggedInCustomer } = await customerAuthService.login(email, password);
    persist(token, loggedInCustomer);
    setCustomer(loggedInCustomer);
    return loggedInCustomer;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('kundali_customer_token');
    localStorage.removeItem('kundali_customer_user');
    setCustomer(null);
  }, []);

  const value = useMemo(
    () => ({ customer, signup, login, logout, isAuthenticated: Boolean(customer) }),
    [customer, signup, login, logout]
  );

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const ctx = useContext(CustomerAuthContext);
  if (!ctx) throw new Error('useCustomerAuth must be used within CustomerAuthProvider');
  return ctx;
}
