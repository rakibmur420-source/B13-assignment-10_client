"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const savedUser = localStorage.getItem("fable_user");
    const savedToken = localStorage.getItem("fable_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
    setLoading(false);
  }, []);

  const register = async (name, email, password, role) => {
    const res = await axios.post(`${API_URL}/api/auth/register`, {
      name,
      email,
      password,
      role,
    });
    const { token, user } = res.data;
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const login = async (email, password) => {
    const res = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    const { token, user } = res.data;
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const googleLogin = async (role) => {
    const result = await signInWithPopup(auth, googleProvider);
    const { displayName, email, photoURL } = result.user;
    const res = await axios.post(`${API_URL}/api/auth/google`, {
      name: displayName,
      email,
      photoURL,
      role: role || "user",
    });
    const { token, user } = res.data;
    localStorage.setItem("fable_token", token);
    localStorage.setItem("fable_user", JSON.stringify(user));
    setToken(token);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem("fable_token");
    localStorage.removeItem("fable_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, googleLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);