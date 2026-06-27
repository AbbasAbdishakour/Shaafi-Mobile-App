// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [doctorId, setDoctorId] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      const role = session?.user?.user_metadata?.role ?? null;
      setUserRole(role);
      if (session?.user && role === 'doctor') {
        await fetchDoctorId(session.user);
      }
      if (session?.user && (role === 'patient' || !role)) {
        await fetchPatientId(session.user);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      const role = session?.user?.user_metadata?.role ?? null;
      setUserRole(role);
      if (session?.user && role === 'doctor') {
        await fetchDoctorId(session.user);
        setPatientId(null);
      } else if (session?.user && (role === 'patient' || !role)) {
        await fetchPatientId(session.user);
        setDoctorId(null);
      } else {
        setDoctorId(null);
        setPatientId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDoctorId = async (currentUser) => {
    const { data } = await supabase.from('doctors').select('id').eq('user_id', currentUser.id).single();
    setDoctorId(data?.id || null);
  };

  const fetchPatientId = async (currentUser) => {
    const { data } = await supabase.from('patients').select('id').eq('user_id', currentUser.id).single();
    setPatientId(data?.id || null);
  };

  const signIn = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signUp = async (email, password, fullName, role = 'patient') => {
    const { data, error } = await supabase.auth.signUp({
      email, password,
      options: { data: { full_name: fullName, role: role } },
    });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null); setUserRole(null); setDoctorId(null); setPatientId(null);
  };

  const getUserName = () => {
    if (!user) return 'User';
    return user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  };

  const isDoctor = () => userRole === 'doctor';
  const isPatient = () => userRole === 'patient' || !userRole;

  return (
    <AuthContext.Provider value={{ user, loading, userRole, doctorId, patientId, signIn, signUp, signOut, getUserName, isDoctor, isPatient }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);