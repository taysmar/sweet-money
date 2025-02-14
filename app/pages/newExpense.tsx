import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Alert, Pressable, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import colors from "./colors";
import { TextInput } from "react-native-gesture-handler";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NewExpense = () => {
  const navigation = useNavigation();
  const [entradaName, setEntradaName] = useState('');
  const [entradaValue, setEntradaValue] = useState('');
  const [entradaData, setEntradaData] = useState('');
  const [entradas, setEntradas] = useState<EntradaProps[]>([]);
  const [saidaName, setSaidaName] = useState('');
  const [saidaValue, setSaidaValue] = useState('');
  const [saidaData, setSaidaData] = useState('');
  const [saidas, setSaidas] = useState<SaidaProps[]>([]);


  const [modalVisibleEntrada, setModalVisibleEntrada] = useState(false);
  const [modalVisibleSaida, setModalVisibleSaida] = useState(false);

  type EntradaProps = {
    id: string;
    name: string;
    value: string;
    date: string;
  }

  type SaidaProps = {
    id: string;
    name: string;
    value: string;
    date: string;
  }

  const saveEntrada = async (entradas: EntradaProps[]) => {
    try {
      await AsyncStorage.setItem('entradas', JSON.stringify(entradas))
    } catch (error) {
      console.error('Erro: ', error)
    }
  }

  const handleSaveEntrada = async () => {
    if (!entradaName || !entradaValue) return;

    const newEntrada = { id: Date.now().toString(), name: entradaName, value: entradaValue, date: Date.now().toString() };
    const updatedEntradas = [...entradas, newEntrada];

    setEntradas(updatedEntradas);
    await saveEntrada(updatedEntradas);

    setEntradaName('');
    setEntradaValue('');
    setEntradaData('');
    setModalVisibleEntrada(!modalVisibleEntrada)
  }

const loadEntradas = async () => {
    try {
      const entradasArmazenadas = await AsyncStorage.getItem('entradas');
      if (entradasArmazenadas) {
        setEntradas(JSON.parse(entradasArmazenadas));
      }
    } catch (error) {
      console.error('Erro: ', error)
    }
  }

  useEffect(() => {
    loadEntradas()
  }, [])

  const saveSaida = async (saidas: SaidaProps[]) => {
    try {
      await AsyncStorage.setItem('saidas', JSON.stringify(saidas))
    } catch (error) {
      console.error('Erro: ', error)
    }
  }

  const handleSavesaida = async () => {
    if (!saidaName || !saidaValue) return;

    const newsaida = { id: Date.now().toString(), name: saidaName, value: saidaValue, date: Date.now().toString() };
    const updatedsaidas = [...saidas, newsaida];

    setSaidas(updatedsaidas);
    await saveSaida(updatedsaidas);

    setSaidaName('');
    setSaidaValue('');
    setSaidaData('');
    setModalVisibleSaida(!modalVisibleSaida)
  }

  const loadsaidas = async () => {
    try {
      const saidasArmazenadas = await AsyncStorage.getItem('saidas');
      if (saidasArmazenadas) {
        setSaidas(JSON.parse(saidasArmazenadas));
      }
    } catch (error) {
      console.error('Erro: ', error)
    }
  }

  useEffect(() => {
    loadsaidas()
  }, [])

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleEntrada}
        onRequestClose={() => {
          Alert.alert('Modal closed.')
          setModalVisibleEntrada(!modalVisibleEntrada);
        }}>
        <View style={styles.viewContainerEntrada}>
          <Text>Nomeie a entrada</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Salário, mesada, etc"
            value={entradaName}
            onChangeText={setEntradaName}
          />
          <Text>Valor Desejado (R$)</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 5000"
            keyboardType="numeric"
            value={entradaValue}
            onChangeText={setEntradaValue} />
          <Button style={styles.saveButton} onPress={handleSaveEntrada}>Adicionar</Button>
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleSaida}
        onRequestClose={() => {
          Alert.alert('Modal closed.')
          setModalVisibleSaida(!modalVisibleSaida);
        }}>
        <View style={styles.viewContainerSaida}>
          <Text>Saída</Text>
          <View style={styles.viewContainerSaida}>
            <Text>Nomeie a saida</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: ALuguel, Mercado, etc"
              value={saidaName}
              onChangeText={setSaidaName}
            />

            <Text>Valor Desejado (R$)</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 5000"
              keyboardType="numeric"
              value={saidaValue}
              onChangeText={setSaidaValue} />
            <Button style={styles.saveButton} onPress={handleSavesaida}>Adicionar</Button>
          </View>
        </View>
      </Modal>
      <View>
        <Text style={styles.title}>Entradas</Text>
        <Button mode="contained" onPress={() => setModalVisibleEntrada(true)}>
          adicionar entrada
        </Button>
      </View>
      <View>
        <Text style={styles.title}>Saídas</Text>
        <Button mode="contained" onPress={() => setModalVisibleSaida(true)}>
          adicionar saída
        </Button>
      </View>
      <View style={styles.entradaContainer}>

        <Text>Entradas :D</Text>
        <FlatList
          data={entradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.entradaItem}>
              <Text>{item.name} - R$ {item.value}</Text>
            </View>
          )}
        />
      </View>
      <View style={styles.saidaContainer}>

        <Text>Saídas :c</Text>
        <FlatList
          data={saidas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.entradaItem}>
              <Text>{item.name} - R$ {item.value}</Text>
            </View>
          )}
        />
      </View>
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
  button: {

  },
  buttonClose: {

  },
  textStyle: {

  },
  viewContainerEntrada: {
    flex: 1,
    backgroundColor: colors.azul_bebe,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 35,
    shadowColor: colors.roxo,

  },
  viewContainerSaida: {
    flex: 1,
    backgroundColor: colors.azul_bebe,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    padding: 35,
    shadowColor: colors.roxo,

  },
  input: {
    backgroundColor: colors.branco_gelo,
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: colors.roxo,
    padding: 10,
  },
  addInfocontainer: {

  },
  entradaItem: {

  },
  saidaContainer: {
    flex: 2
  },
  entradaContainer: {
    flex: 2
  }
});

export default NewExpense;
