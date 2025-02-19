import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { PieChart } from "react-native-gifted-charts";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "./colors";

type Transaction = {
  value: number;
  label: string;
  category: string;
  color: string;
}
const Stats = () => {
  const navigation = useNavigation();

  const [entradas, setEntradas] = useState([]);
  const [saidas, setSaidas] = useState([]);
  const [formatedEntradas, setFormatedEntradas] = useState<Transaction[]>([]);
  const [formatedSaidas, setFormatedSaidas] = useState<Transaction[]>([]);
  const [totalGasto, setTotalGasto] = useState(0);
  const [legendas, setLegendas] = useState<{ category: string; color: string }[]>([]);

  const saidaColors = ["#F44336", "#FF7043", "#FFAB91", "#D84315"];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedEntradas = await AsyncStorage.getItem("entradas");
        if (storedEntradas) {
          const parsedEntradas = JSON.parse(storedEntradas);
          setEntradas(parsedEntradas);

          if (Array.isArray(parsedEntradas) && parsedEntradas.length > 0) {
            const formatedEntradas = parsedEntradas.map((item, index) => ({
              value: Number(item.value),
              label: `#${index + 1}`,
              category: item.category || "Sem categoria",
              color: colors.verde,
            }));
            setFormatedEntradas(formatedEntradas);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar entradas:", error);
      }

      try {
        const storedSaidas = await AsyncStorage.getItem("saidas");
        if (storedSaidas) {
          const parsedSaidas = JSON.parse(storedSaidas);
          setSaidas(parsedSaidas);

          if (Array.isArray(parsedSaidas) && parsedSaidas.length > 0) {
            const formatedSaidas = parsedSaidas.map((item, index) => ({
              value: Number(item.value),
              label: `#${index + 1}`,
              category: item.category || "Sem categoria",
              color: saidaColors[index % saidaColors.length],
            }));

            setFormatedSaidas(formatedSaidas);

            // Calcular total de gastos
            let total = formatedSaidas.reduce((acc, item) => acc + item.value, 0);
            setTotalGasto(total);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar saídas:", error);
      }
    };

    loadTransactions();
  }, []);

  const pieData = [...formatedEntradas, ...formatedSaidas].map((item) => ({
    value: item.value,
    color: item.color,
    text: item.category,
  }));

  useEffect(() => {
    const uniqueCategories = new Map(); // Criamos um Map() para armazenar categorias únicas

    [...formatedSaidas].forEach((item) => {
      if (!uniqueCategories.has(item.category)) {
        uniqueCategories.set(item.category, item.color);
      }
    });

    // Convertendo Map para array e atualizando estado
    setLegendas(Array.from(uniqueCategories, ([category, color]) => ({ category, color })));
  }, [formatedSaidas]);




  return (
    <View style={styles.container}>
      <View style={styles.pieChartContainer}>
        <Text style={styles.pieTitle}>Gastos por categoria</Text>
        <PieChart
          donut
          radius={100}
          textBackgroundRadius={26}
          data={pieData}
        />

        <Text style={styles.totalGasto}>R$ {totalGasto}</Text>
        <Text style={styles.legendaTotalGasto}>Total de gastos até o momento</Text>
      <View style={styles.legendContainer}>
        <FlatList
          data={legendas}
          keyExtractor={(item) => item.category}
          renderItem={({ item }) => (
            <View style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: item.color }]} />
              <Text style={styles.legendText}>{item.category}</Text>
            </View>
          )}
        />
      </View>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent",
    padding: 16,
  },
  pieChartContainer: {
    marginTop: 40,
    marginHorizontal: 5,
    backgroundColor: colors.branco_gelo,
    borderRadius: 10,
    height: 380,
    alignItems: "center",
    justifyContent: "center",

  },
  pieTitle:{
    fontSize:16,
    fontWeight:'bold',
    color:'#939393',
    marginVertical: 15
  },
  legendContainer: {
    marginVertical: 15,

    alignSelf: "center",
    width: "90%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  totalGasto:{
    fontSize: 30,
    fontWeight: 'bold'
  },
  legendaTotalGasto:{
    fontSize: 10,
    color: '#939393'
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
  },
});

export default Stats;
