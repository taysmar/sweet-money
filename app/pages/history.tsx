import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, FlatList, RefreshControl } from "react-native";
import colors from "./colors";
import { supabase } from "@/assets/config/supabase";
import {format} from 'date-fns';
import {ptBR} from 'date-fns/locale';

const History = () => {
   const [userId, setUserId] = useState<string | null>(null);
   const [transactions, setTransactions] = useState<Transactions[]>([]);
   const [refreshing, setRefreshing] = useState(false);
   
   useEffect(() => {
     loadTransactions();
   }, [userId]);
 
   type Transactions = {
    transaction_id: number;
    type: "entrada" | "saida";
    name: string;
    date: string;
    amount:number;
    category:string;
    description: string;
  };

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
    if(!userId) return;
    const {data, error} = await supabase
    .from("transactions")
    .select("*")
    .eq("client_id", userId);

    if(error) {
      console.log(error);
      return
    }

    setTransactions(data)
}
const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  setTimeout(() => {
    setRefreshing(false);
  }, 2000);
}, []);

  return (
    <View style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Histórico</Text>
      </View>
      <FlatList
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.description}</Text>
              <Text style={styles.itemData}>{format(new Date(item.date), "dd/MM/yyyy", { locale: ptBR })}
              </Text>
            </View>
            <Text
              style={[
                styles.itemTextValue,
                item.type === "entrada" ? styles.entrada : styles.saida, 
              ]}
            >
              R$ {item.amount}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.line} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  historyContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    marginHorizontal: 19,
    marginVertical: 10,
    borderRadius: 21,
    paddingBottom: 10,
  },
  historyHeader: {
    alignItems: "center",
    marginTop: 10,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  itemInfo: {},
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemData: {
    fontSize: 12,
    color: "gray",
  },
  itemTextValue: {
    fontSize: 20,
    fontWeight: "bold",
  },
  entrada: {
    color: "green",
  },
  saida: {
    color: "red",
  },
  line: {
    borderBottomColor: "rgba(0, 0, 0, 0.18)",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  },
});

export default History;
