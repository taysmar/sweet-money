import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Appbar, Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LineChart, PieChart } from "react-native-gifted-charts";
import AsyncStorage from '@react-native-async-storage/async-storage';
import colors from "./colors";

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
          setEntradas(parsedEntradas);
          
          if (Array.isArray(parsedEntradas) && parsedEntradas.length > 0) {
            const formatted = parsedEntradas.map((item, index) => ({
              value: Number(item.value), // 🔹 Converte para número
              label: `#${index + 1}`,
            }));
            
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
          
          setSaidas(parsedSaidas);
          
          if (Array.isArray(parsedSaidas) && parsedSaidas.length > 0) {
            const formatted = parsedSaidas.map((item, index) => ({
              value: Number(item.value), // 🔹 Converte para número
              label: `#${index + 1}`,
            }));
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
  
  const pieData = [
    {value: 3200, color:colors.verde},
    {value: 300, color:colors.rosa_salmao}
  
  ]
  return (
    <View style={styles.container}>

      <Appbar.Header style={styles.header}>
        <Appbar.Content title="sweet money" titleStyle={styles.headerTitle} />
        {/* <Appbar.Action icon="arrow-left" iconColor={colors.branco_gelo} onPress={() => { }} /> */}
      </Appbar.Header>

      <View style={styles.pieChartContainer}>
        <Text>Gastos por categoria</Text>
          <PieChart 
          donut
          radius={100}
          showTextBackground
          data={pieData}/>
        <Text>R$ 1250</Text>
        <Text>Total de gastos até o momento</Text>

      </View>

      {/* {validFormatedEntradas.length > 0 || validFormatedSaidas.length > 0 ? (
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
      </Button> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 16
  },
  containerHeader: {

  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  header: {
    backgroundColor: colors.rosa_salmao,
    borderRadius: 21,
    marginVertical: 21,
    height: 30,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,

  },
  headerTitle: {
    textAlign: 'center',
    color: colors.branco_gelo,
    fontWeight: 'bold',
  },
  pieChartContainer:{
    marginTop:48,
    marginHorizontal: 5,
    backgroundColor: colors.branco_gelo,
    borderRadius: 10,
    height: 320,
    alignItems:'center'

  }
});

export default Stats;
