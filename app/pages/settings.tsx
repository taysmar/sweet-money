import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/assets/config/supabase";
import colors from "./colors";

const Settings = () => {
  const navigation = useNavigation();


const handleLogout = async () => {
  Alert.alert("Certeza?","Certeza que já vai embora? :c",[
    {
      text:"sim, vou embora 😢",
      onPress: async () => {  
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Erro ao deslogar:", error);
      }},
      
    },
    {
      text:"não 😨"
    }
  ])

};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configurações em construção, volte mais tarde</Text>
      <Button mode="contained" onPress={() => navigation.goBack()}>
        Voltar
      </Button>

      <Button textColor={colors.preto_suave} style={styles.logoutBtn} onPress={() => handleLogout()}>Logout</Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  logoutBtn:{
    backgroundColor: colors.verde,
    width:140,
    margin:30
  }
});

export default Settings;
