"use client";
import React from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/home";
import Savings from "./pages/savings";
import Stats from "./pages/stats";
import NewExpense from "./pages/newExpense";
import Settings from "./pages/settings";
import { LinearGradient } from "expo-linear-gradient";

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Stats: undefined;
  NewExpense: undefined;
  Settings: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function index() {
  return (
    <LinearGradient
      colors={["#FFB6C1", "#FBB8C4", "#AEE2FF"]}
      style={styles.background}
      locations={[0.35, 0.65, 0.88]}
    >
      <View style={styles.overlay}>
      <View style={styles.container}>
        
        <StatusBar barStyle={"light-content"} backgroundColor={'#F4AEB9'}/>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: "transparent" },
            
          }}
          >
          <Stack.Screen name="Home" component={Home} options={{title: ''}}/>
          <Stack.Screen name="Savings" component={Savings} />
          <Stack.Screen name="Stats" component={Stats} />
          <Stack.Screen name="NewExpense" component={NewExpense} />
          <Stack.Screen name="Settings" component={Settings} />
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
  overlay:{
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  }

});
