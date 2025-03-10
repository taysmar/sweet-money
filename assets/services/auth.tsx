import { Alert } from "react-native";
import { supabase } from "../config/supabase";

// Criar uma conta nova
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) throw error;
  return data;
};

// Fazer login
export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
};

// Fazer logout
export const signOut = async () => {
  Alert.alert("Certeza que já vai embora? :c")
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

// Verificar usuário logado
export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data;
};
