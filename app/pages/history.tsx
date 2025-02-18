import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView, FlatList } from "react-native";
import colors from "./colors";

type Transaction = {
  value: number;
  name: string;
  date: string;
};

const loadTransactions = async (): Promise<Transaction[]> => {
  try {
    const storedEntradas = await AsyncStorage.getItem("entradas");
    const storedSaidas = await AsyncStorage.getItem("saidas");

    const parsedEntradas: Transaction[] = storedEntradas ? JSON.parse(storedEntradas) : [];
    const parsedSaidas: Transaction[] = storedSaidas ? JSON.parse(storedSaidas) : [];

    return [...parsedEntradas, ...parsedSaidas]; 
  } catch (error) {
    console.error("Erro ao carregar transações:", error);
    return [];
  }
};

const History = () => {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState<Transaction[]>([]); 

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await loadTransactions();
      setTransactions(data);
    };

    fetchTransactions();
  }, []);

  return (
    <SafeAreaView style={styles.historyContainer}>
      <View style={styles.historyHeader}>
        <Text style={styles.historyTitle}>Histórico</Text>
      </View>

      <FlatList
        data={transactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemData}>{item.date}</Text>
            </View>
            <Text
              style={[
                styles.itemTextValue,
                item.value >= 0 ? styles.entrada : styles.saida,
              ]}
            >
              {item.value}
            </Text>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.line} />}
      />
    </SafeAreaView>
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
