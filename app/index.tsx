"use client";
import React from "react";
import { View, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "./pages/home";
import Savings from "./pages/savings";
import Stats from "./pages/stats";
import NewExpense from "./pages/newExpense";
import Settings from "./pages/settings";

const Stack = createStackNavigator();

export default function Index() {
  return (
    <View style={styles.container}>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Savings" component={Savings} />
          <Stack.Screen name="Stats" component={Stats} />
          <Stack.Screen name="NewExpense" component={NewExpense} />
          <Stack.Screen name="Settings" component={Settings} />

        </Stack.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
