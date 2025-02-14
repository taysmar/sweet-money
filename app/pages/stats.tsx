import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LineChart } from "react-native-gifted-charts";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stats = () => {
  const navigation = useNavigation();
  
  const [entradas, setEntradas] = useState<{ value: number; name: string; date: string }[]>([]);
  const [saidas, setSaidas] = useState<{ value: number; name: string; date: string }[]>([]);
  const [formatedEntradas, setFormatedEntradas] = useState<{ value: number; label: string }[]>([]);
  const [formatedSaidas, setFormatedSaidas] = useState<{ value: number; label: string }[]>([]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedEntradas = await AsyncStorage.getItem('entradas');
        if (storedEntradas) {
          const parsedEntradas = JSON.parse(storedEntradas);
          console.log("📊 Entradas carregadas:", parsedEntradas);
          setEntradas(parsedEntradas);

          if (Array.isArray(parsedEntradas) && parsedEntradas.length > 0) {
            const formatted = parsedEntradas.map((item, index) => ({
              value: Number(item.value), // 🔹 Converte para número
              label: `#${index + 1}`,
            }));

            console.log("📈 Dados formatados para gráfico (entradas):", formatted);
            setFormatedEntradas(formatted);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar entradas:", error);
      }

      try {
        const storedSaidas = await AsyncStorage.getItem('saidas');
        if (storedSaidas) {
          const parsedSaidas = JSON.parse(storedSaidas);
          console.log("📊 Saídas carregadas:", parsedSaidas);
          setSaidas(parsedSaidas);

          if (Array.isArray(parsedSaidas) && parsedSaidas.length > 0) {
            const formatted = parsedSaidas.map((item, index) => ({
              value: Number(item.value), // 🔹 Converte para número
              label: `#${index + 1}`,
            }));

            console.log("📉 Dados formatados para gráfico (saídas):", formatted);
            setFormatedSaidas(formatted);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar saídas:", error);
      }
    };

    loadTransactions();
  }, []);

  // 🔹 Garante que não há valores inválidos
  const validFormatedEntradas = formatedEntradas.filter((item) => item.value > 0);
  const validFormatedSaidas = formatedSaidas.filter((item) => item.value > 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚀 Estatísticas 🚀</Text>

      {validFormatedEntradas.length > 0 || validFormatedSaidas.length > 0 ? (
        <LineChart
          data={validFormatedEntradas}
          data2={validFormatedSaidas}
          width={350}
          height={250}
          noOfSections={4}
          color1="#4CAF50" // Verde para entradas
          color2="#FF5252" // Vermelho para saídas
          thickness={3}
          xAxisLabelTexts={validFormatedEntradas.map((item) => item.label)}
          yAxisThickness={1}
          xAxisThickness={1}
          isAnimated
          initialSpacing={10} // 🔹 Garante que os pontos aparecem
        />
      ) : (
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>Carregando dados...</Text>
      )}

      <Button mode="contained" onPress={() => navigation.goBack()}>
        Voltar
      </Button>
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
});

export default Stats;
