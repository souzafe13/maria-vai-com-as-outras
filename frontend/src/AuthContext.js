import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request } from './api';

const AuthContext = createContext(null);
const STORAGE_KEY = 'auth';

// Estado global do app: quem está logado (token e nome).
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null); // { token, name }
  const [loading, setLoading] = useState(true);

  // Ao abrir o app, lê a sessão salva no celular (AsyncStorage).
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((saved) => {
        if (saved) setSession(JSON.parse(saved));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveSession(data) {
    setSession(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  async function login(email, password) {
    let data;
    try {
      data = await request('/auth/login', { method: 'POST', body: { email, password } });
    } catch (e) {
      // 401 no login = e-mail ou senha incorretos
      if (e.status === 401) throw new Error('E-mail ou senha incorretos. Confira e tente de novo.');
      throw e;
    }
    await saveSession(data);
  }

  async function register(name, email, password) {
    const data = await request('/auth/register', { method: 'POST', body: { name, email, password } });
    await saveSession(data);
  }

  async function logout() {
    setSession(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}