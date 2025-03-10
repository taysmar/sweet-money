import React, { useState } from "react";
import { View, TextInput, Button, Alert, AppState, StyleSheet, TouchableOpacity } from "react-native";
import { signIn, signUp } from "../../assets/services/auth";
import { supabase } from "@/assets/config/supabase";
import { Appbar } from "react-native-paper";
import colors from "./colors";
import AppText from "./fontApp";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";


AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh
  }
})

const LoginScreen = () => {
  const navigation = useNavigation()
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
      Alert.alert("Login realizado!", "Bem-vindo de volta.", [{
        text: 'ok', onPress: () =>  router.push("/")

      }]
      );
    } catch (error: any) {
      Alert.alert("Erro ao fazer login", error.message);
    }
  };

  return (

    
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText style={styles.headerTitle}>sweet money</AppText>
      </View>
      <View style={styles.bodyContainer}>
      <KeyboardAwareScrollView 
        extraScrollHeight={100}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
        <AppText style={styles.loginTitle}>Não possui uma conta?</AppText>
        <TouchableOpacity onPress={() => handleSignUp()}>
          <View style={styles.buttonCadastro}>
            <AppText>Cadastre-se</AppText>
          </View>
          </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View  style={styles.linha}/>
          <AppText style={styles.ou}>ou</AppText>
      <View  style={styles.linha}/>

      </View>

        <View style={styles.loginInput}>
          <AppText>Login:</AppText>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />

          <AppText>Senha:</AppText>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        <TouchableOpacity onPress={() => handleSignIn()}>
          <View style={styles.buttonLogin}>
            <AppText>Bem vindo de volta!</AppText>
          </View>
          </TouchableOpacity>
        </View>
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.rosa_salmao,
    borderRadius: 21,
    marginTop: 102,
    height: 55,
    width: 273,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
    justifyContent: 'center',
    marginHorizontal: 40

  },
  headerTitle: {
    textAlign: 'center',
    color: colors.branco_gelo,
    fontWeight: 'bold',
    fontSize: 25,
  },
  
  bodyContainer: {
    backgroundColor: colors.branco_gelo,
    width: '90%',
    height: 512,
    marginHorizontal: 18,
    borderRadius: 10,
    marginTop: 26,
    alignItems: 'center',
  },
  loginInput: {

  },
  input: {
    borderColor: colors.roxo,
    borderWidth: 1,
    borderRadius: 10,

  },
  loginTitle:{
    fontSize: 20,
    color:colors.preto_suave,
    marginTop: 32,
    fontWeight: 'semibold'

  },
  dividerContainer:{
    flexDirection:'row',
    alignItems:'center',
    width:"80%",
    marginVertical: 20
  },
  linha: {
    flex: 1, 
    height: 1,
    backgroundColor: colors.preto_suave,
  },
  ou:{
    fontSize: 16,
    fontFamily: "Onest-Regular", 
    color: colors.preto_suave, 
    marginHorizontal: 10, 
  },
  buttonCadastro:{
    marginTop: 17,
    backgroundColor:colors.verde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12
  },

  buttonLogin:{
    backgroundColor:colors.verde,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginVertical: 37
  },

})

export default LoginScreen;
