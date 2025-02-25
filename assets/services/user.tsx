import { supabase } from '../config/supabase';

export const getUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Erro ao obter usuário:', error.message);
    return null;
  }

  return data.user;
};
