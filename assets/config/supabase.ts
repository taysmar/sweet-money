import { createClient } from "@supabase/supabase-js";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AppState } from "react-native";

// Substitua com as suas credenciais do Supabase
const SUPABASE_URL = "https://prbmszlrrdoqcukqopna.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByYm1zemxycmRvcWN1a3FvcG5hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAwNzAzOTcsImV4cCI6MjA1NTY0NjM5N30.MOZk9BFEMv6HS_msHX49utoryYn81d6zaVXlMNZ7PU8";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
  
