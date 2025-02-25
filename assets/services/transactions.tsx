import { supabase } from "../config/supabase";

export const addTransaction = async (
    userId: string,
    amount: number,
    type: "income" | "expense",
    category: string,
    description?: string
) => {
  const { data, error } = await supabase
  .from("transactions")
  .insert([{ user_id: userId, amount, type, category, description}]);
  
  if (error) throw error;
  return data;
}

export const getTransactions = async (userId: string) => {
    const { data, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false });

  if (error) throw error;
  return data;
}