import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, AppState } from "react-native";
import { signIn, signUp } from "../../assets/services/auth";
import { supabase } from "@/assets/config/supabase";
import Home from "./home";

AppState.addEventListener('change', (state) => {
  if(state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh
  }
})

const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)


  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      Alert.alert("Conta criada!", "Verifique seu e-mail para confirmar.");
    } catch (error: any) {
      Alert.alert("Erro ao criar conta", error.message);
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(email, password);
      Alert.alert("Login realizado!", "Bem-vindo de volta.");
    } catch (error: any) {
      Alert.alert("Erro ao fazer login", error.message);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text>Email:</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Text>Senha:</Text>
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Digite sua senha"
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button title="Entrar" onPress={handleSignIn} />
      <Button title="Criar Conta" onPress={handleSignUp} />
    </View>
  );
};

export default LoginScreen;
