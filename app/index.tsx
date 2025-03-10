"use client";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/home";
import Savings from "./pages/savings";
import Stats from "./pages/stats";
import NewExpense from "./pages/newExpense";
import Settings from "./pages/settings";
import LoginScreen from "./pages/login";
import { LinearGradient } from "expo-linear-gradient";
import { Session } from "@supabase/supabase-js";
import { supabase } from "@/assets/config/supabase";

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Stats: undefined;
  NewExpense: undefined;
  Settings: undefined;
  Login: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function Index() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    checkSession();

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);
  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle={"light-content"} backgroundColor={"#F4AEB9"} />
      </View>
    );
  }
  return (

    <LinearGradient
      colors={["#FFB6C1", "#FBB8C4", "#AEE2FF"]}
      style={styles.background}
      locations={[0.35, 0.65, 0.88]}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <StatusBar barStyle={"light-content"} backgroundColor={"#F4AEB9"} />
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: "transparent" },
              }}
            >
              {session ? (
                <>
                  <Stack.Screen name="Home" component={Home} />
                  <Stack.Screen name="Savings" component={Savings} />
                  <Stack.Screen name="Stats" component={Stats} />
                  <Stack.Screen name="NewExpense" component={NewExpense} />
                  <Stack.Screen name="Settings" component={Settings} />
                </>
              ) : (
                <Stack.Screen name="Login" component={LoginScreen} />
              )}
            </Stack.Navigator>
          
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFB6C1",
  },
});
