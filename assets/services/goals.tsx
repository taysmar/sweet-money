import { supabase } from "../config/supabase";

export const addGoal = async (userId: string, goalName: string, targetAmount: number, deadline: string, icon: string) => {
    const {data, error} = await supabase
    .from("goals")
    .insert([{user_id: userId, goal_name: goalName, target_amount: targetAmount, deadline: deadline, icon:icon}])

if (error) throw error;
return data;
}


export const getGoals = async (userId: string) => {
    const { data, error } = await supabase
    .from("goals")
    .select("*")
    .eq("user_id", userId)
    .order("deadline", {ascending: true})

if (error) throw error;
return data;
}