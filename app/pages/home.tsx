import { useNavigation } from "@react-navigation/native";
import { Appbar, Button } from 'react-native-paper'
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, SafeAreaView, ScrollView, RefreshControl } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "./colors";
import History from "./history";
import { supabase } from "@/assets/config/supabase";

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Stats: undefined;
  NewExpense: undefined;
  Settings: undefined;
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userId, setUserId] = useState<string | null>(null);
  const [saldo, setSaldo] = useState(0);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (data?.user?.id) {
        setUserId(data.user.id);
      } else {
        console.error("Erro ao obter usuário:", error);
      }
    };
    fetchUser();
  }, []);

  const loadTransactions = async () => {
      if (!userId) return;
      const { data, error } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("client_id", userId)

  if (error) {
      console.error("Erro ao buscar transações:", error);
      return;
  }

  const total = data.reduce((acc, transaction) =>{
    return transaction.type==="entrada"
    ? acc + transaction.amount
    : acc - transaction.amount;
  }, 0)
setSaldo(total)
  };
  
    useEffect(() => {
      loadTransactions();
    }, );

  return (
    <View style={styles.container}>
      <ScrollView refreshControl={ <RefreshControl refreshing={refreshing} onRefresh={onRefresh} /> } >
      <View style={styles.headerContainer}>

      <Appbar.Header style={styles.header}>
        <Appbar.Content title="sweet money" titleStyle={styles.headerTitle} />
      </Appbar.Header>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Saldo atual</Text>
        <Text  style={[
          styles.itemTextValue,
          saldo > 0 ? styles.balanceAmount : styles.balanceAmountnegative, 
        ]}
        >{saldo}</Text>
      </View>
        </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate("NewExpense")}>
          <MaterialIcons name="attach-money" size={30} style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Savings')}>
          <MaterialIcons name="savings" size={30} style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
          <MaterialIcons name="bar-chart" size={30} style={styles.iconButton} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={30} style={styles.iconButton} />
        </TouchableOpacity>
      </View>
              </ScrollView>


      <View style={styles.historyContainer}>
        <History />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

  },
  headerContainer:{
    flex:1,
    marginHorizontal:19,
    marginTop:10
  },
  header: {
    backgroundColor: colors.rosa_salmao,
    borderRadius: 21,
    marginVertical: 21,
    height: 30,
    shadowOffset: { width: 6, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 10,
  },
  headerTitle: {
    textAlign: 'center',
    color: colors.branco_gelo,
    fontWeight: 'bold',
  },
  balanceContainer: {
    backgroundColor: colors.branco_gelo,
    marginTop: 21,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 21,
    marginBottom: 10,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
  },
  balanceText: {
    textAlign: 'right',
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: "#34C759",
    textAlign: 'right',

  },
  balanceAmountnegative:{
    fontSize: 26,
    fontWeight: 'bold',
    color: "red",
    textAlign: 'right',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 11,
    marginHorizontal:6,
    alignItems: 'stretch',
  },
  historyContainer: {
    flex: 1000,
    backgroundColor: colors.branco_gelo,
    marginHorizontal: 19,
    marginVertical: 10,
    borderRadius: 21,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
  },
 
  iconButton: {
    color: colors.branco_gelo,
    backgroundColor: colors.verde,
    width: 55,
    height: 45,
    textAlignVertical: 'center',
    borderRadius: 10,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
    textAlign: 'center',
  },
  itemTextValue:{

  }

})

