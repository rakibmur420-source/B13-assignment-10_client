"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import axios from "axios";

const AuthContext = createContext();

// Normalize user object so both user.id and user._id always work
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    ...user,
    id: user.id || user._id,
    _id: user._id || user.id,
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("fable_user");
      const savedToken = localStorage.getItem("fable_token");
      if (savedUser && savedToken) {
        setUser(normalizeUser(JSON.parse(savedUser)));
        setToken(savedToken);
      }
    } catch (err) {
      localStorage.removeItem("fable_user");
      localStorage.removeItem("fable_token");
    } finally {
      setLoading(false);
    }
  }, []);

  const register = async (name, email, password, role) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, { name, email, password, role });
    const { token, user } = res.data;
    const normalized = normalizeUser(user);
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(normalized));
    setToken(token);
    setUser(normalized);
    return normalized;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, { email, password });
    const { token, user } = res.data;
    const normalized = normalizeUser(user);
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(normalized));
    setToken(token);
    setUser(normalized);
    return normalized;
  };

  const googleLogin = async (role) => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;
    const res = await axios.post(`${API_URL}/api/auth/google`, {
      name: displayName, email, photoURL, role: role || "user",
    });
    const { token, user } = res.data;
    const normalized = normalizeUser(user);
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(normalized));
    setToken(token);
    setUser(normalized);
    return normalized;
  };

  const logout = async () => {
    try { await signOut(auth); } catch (e) {}
    localStorage.removeItem("fable_token");
    localStorage.removeItem("fable_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, register, login, googleLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
