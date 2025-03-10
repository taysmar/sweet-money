import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView, RefreshControl, ActivityIndicator, Animated, useAnimatedValue,  } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { supabase } from "@/assets/config/supabase";
import colors from "./colors";
import AppText from "./fontApp";
import LottieView from "lottie-react-native";

type Transaction = {
  value: number;
  label: string;
  category: string;
  color: string;
};

const Stats = () => {
  const [entradas, setEntradas] = useState<Transaction[]>([]);
  const [saidas, setSaidas] = useState<Transaction[]>([]);
  const [totalGasto, setTotalGasto] = useState(0);
  const [totalEntradasSum, setTotalEntradasSum] = useState<number>(0);
  const [pieData, setPieData] = useState<Transaction[]>([]);
  const [legendas, setLegendas] = useState<{ category: string; color: string }[]>([]);
  const saidaColors = ["#F44336", "#FF7043", "#FFAB91", "#D84315"];
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const scrollX = useAnimatedValue(0);


  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Erro ao obter usuário:", error);
      } else if (data?.user?.id) {
        setUserId(data.user.id);
      }
    };
    fetchUser();
  }, []);

  const loadTransactions = async () => {
    if (!userId) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("amount, category, type")
        .eq("client_id", userId);

      if (error) {
        console.error("Erro ao carregar transações do banco:", error);
        setLoading(false);
        return;
      }

      const formattedEntradas = data
        .filter((t) => t.type === "entrada")
        .map((item, index) => ({
          value: Number(item.amount),
          label: `Entrada ${index + 1}`,
          category: item.category || "Entrada",
          color: colors.verde,
        }));

      const formattedSaidas = data
        .filter((t) => t.type === "saida")
        .map((item, index) => ({
          value: Number(item.amount),
          label: `Saída ${index + 1}`,
          category: item.category || "Sem categoria",
          color: saidaColors[index % saidaColors.length],
        }));

      setEntradas(formattedEntradas);
      setSaidas(formattedSaidas);

      const totalEntradasSum = formattedEntradas.reduce((acc, item) => acc + item.value, 0);
      setTotalEntradasSum(totalEntradasSum);

      const totalGasto = formattedSaidas.reduce((acc, item) => acc + item.value, 0);
      setTotalGasto(totalGasto);

      const valorRestante = totalEntradasSum - totalGasto;

      const categoryTotals = formattedSaidas.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = 0;
        }
        acc[item.category] += item.value;
        return acc;
      }, {} as Record<string, number>);

      const pieData = Object.entries(categoryTotals).map(([category, value], index) => ({
        value: totalEntradasSum > 0 ? (value / totalEntradasSum) * 100 : 0,
        label: `${((value / totalEntradasSum) * 100).toFixed(1)}%`,
        category,
        color: saidaColors[index % saidaColors.length],
      }));

      if (valorRestante > 0) {
        pieData.push({
          value: (valorRestante / totalEntradasSum) * 100,
          label: `${((valorRestante / totalEntradasSum) * 100).toFixed(1)}%`,
          category: "Saldo Restante",
          color: colors.verde,
        });
      }

      setLegendas([
        ...Object.keys(categoryTotals).map((category, index) => ({
          category,
          color: saidaColors[index % saidaColors.length],
        })),
        { category: "Saldo Restante", color: colors.verde },
      ]);

      setPieData(pieData);
      setLoading(false);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      loadTransactions();
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require("@/assets/images/055de488-cc9d-41bc-926d-2750615f6152.json")}
            style={{ width: "100%", height: "60%" }}
            autoPlay
            loop
          />
        </View>

      ) : (
        <ScrollView onScroll={Animated.event([
          {
            nativeEvent:{
              contentOffset: {
                x: scrollX,
              },
            },
          },
        ])} scrollEventThrottle={1} 
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={loadTransactions} />}>
          <View style={styles.pieChartContainer}>
            <AppText style={styles.pieTitle}>Gastos por categoria</AppText>
            <PieChart donut radius={100} textBackgroundRadius={26} data={pieData} />
            <AppText style={styles.totalGasto}>R$ {totalGasto}</AppText>
            <AppText style={styles.legendaTotalGasto}>Total de gastos até o momento</AppText>

            <View style={styles.legendContainer}>
              <FlatList
                data={legendas}
                contentContainerStyle={{ flexDirection: "column" }}
                horizontal={true}
                keyExtractor={(item) => item.category}
                renderItem={({ item }) => (
                  <View style={styles.legendItem}>
                    <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                    <AppText style={styles.legendAppText}>{item.category}</AppText>
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "transparent", padding: 16 },
  pieChartContainer: {
    marginTop: 40,
    marginHorizontal: 5,
    backgroundColor: colors.branco_gelo,
    borderRadius: 10,
    minHeight: 450,
    alignItems: "center",
    justifyContent: "center",
  },
  pieTitle: { fontSize: 18, fontWeight: "bold", color: "#939393", marginVertical: 15 },
  legendContainer: { marginVertical: 18, alignSelf: "center", width: "90%" },
  legendItem: { flexDirection: "row", alignItems: "center", marginVertical: 5 },
  totalGasto: { fontSize: 30, fontWeight: "bold" },
  legendaTotalGasto: { fontSize: 10, color: "#939393" },
  legendColor: { width: 15, height: 15, borderRadius: 7.5, marginRight: 10 },
  loadingContainer: {justifyContent: 'center', alignItems:'center', flex:1, width:200, alignContent:'center', alignSelf:'center'},
  legendAppText: { fontSize: 16, margin: 7 },
});

export default Stats;
