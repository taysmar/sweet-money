import React, { useState, useEffect } from "react";
import {View, Text, StyleSheet, Modal, FlatList, TextInput, StatusBar} from "react-native";
import { Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from 'date-fns';
import colors from "./colors";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "react-native-svg";

const Stack = createStackNavigator()

const NewExpense = () => {

  const [entradaName, setEntradaName] = useState('');
  const [entradaValue, setEntradaValue] = useState('');
  const [entradaCategoria, setEntradaCategoria] = useState('');
  const [entradas, setEntradas] = useState<EntradaProps[]>([]);

  const [saidaName, setSaidaName] = useState('');
  const [saidaValue, setSaidaValue] = useState('');
  const [saidaCategoria, setSaidaCategoria] = useState('');
  const [saidas, setSaidas] = useState<SaidaProps[]>([]);

  const [modalEntrada, setModalEntrada] = useState(false);
  const [modalSaida, setModalSaida] = useState(false);

  const [categoriasEntrada, setCategoriasEntrada] = useState<string[]>(["Salário", "Freelance", "Outros"]);
  const [categoriasSaida, setCategoriasSaida] = useState<string[]>(["Aluguel", "Alimentação", "Transporte"]);

  type EntradaProps = {
    id: string;
    name: string;
    value: string;
    category: string;
    date: string;
  };

  type SaidaProps = {
    id: string;
    name: string;
    value: string;
    category: string;
    date: string;
  };

  useEffect(() => {
    carregarDados("entradas", setEntradas);
    carregarDados("saidas", setSaidas);
    carregarDados("categoriasEntrada", setCategoriasEntrada);
    carregarDados("categoriasSaida", setCategoriasSaida);
  }, []);

  const salvarDados = async (chave: string, dados: any[]) => {
    try {
      await AsyncStorage.setItem(chave, JSON.stringify(dados));
    } catch (error) {
      console.error("Erro ao salvar:", error);
    }
  };

  const carregarDados = async (chave: string, setter: Function) => {
    try {
      const dadosArmazenados = await AsyncStorage.getItem(chave);
      if (dadosArmazenados) {
        setter(JSON.parse(dadosArmazenados));
      }
    } catch (error) {
      console.error("Erro ao carregar:", error);
    }
  };

  const adicionarEntrada = async () => {
    if (!entradaName || !entradaValue || !entradaCategoria) return;

    const novaEntrada = {
      id: Date.now().toString(),
      name: entradaName,
      value: entradaValue,
      category: entradaCategoria,
      date: format(new Date(), "dd/MM/yyyy")
    };

    const updatedEntradas = [...entradas, novaEntrada];
    setEntradas(updatedEntradas);
    await salvarDados("entradas", updatedEntradas);

    setEntradaName('');
    setEntradaValue('');
    setEntradaCategoria('');
    setModalEntrada(false);
  };

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



  const adicionarSaida = async () => {
    if (!saidaName || !saidaValue || !saidaCategoria) return;

    const novaSaida = {
      id: Date.now().toString(),
      name: saidaName,
      value: saidaValue,
      category: saidaCategoria,
      date: format(new Date(), "dd/MM/yyyy")
    };

    const updatedSaidas = [...saidas, novaSaida];
    setSaidas(updatedSaidas);
    await salvarDados("saidas", updatedSaidas);

    setSaidaName('');
    setSaidaValue('');
    setSaidaCategoria('');
    setModalSaida(false);
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={modalEntrada} onRequestClose={() => setModalEntrada(false)}>
        <View style={styles.modalContainer}>
          <Text>Nome da Entrada</Text>
          <TextInput style={styles.input} placeholder="Ex: Salário" value={entradaName} onChangeText={setEntradaName} />
          <Text>Valor (R$)</Text>
          <TextInput style={styles.input} placeholder="Ex: 5000" keyboardType="numeric" value={entradaValue} onChangeText={setEntradaValue} />

          <Text>Categoria</Text>
          <Picker selectedValue={entradaCategoria} onValueChange={setEntradaCategoria} style={styles.picker}>
            {categoriasEntrada.map((categoria) => (
              <Picker.Item key={categoria} label={categoria} value={categoria} />
            ))}
          </Picker>

          <Button mode="contained" onPress={adicionarEntrada}>Adicionar Entrada</Button>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={modalSaida} onRequestClose={() => setModalSaida(false)}>
        <View style={styles.modalContainer}>
          <Text>Nome da Saída</Text>
          <TextInput style={styles.input} placeholder="Ex: Aluguel" value={saidaName} onChangeText={setSaidaName} />
          <Text>Valor (R$)</Text>
          <TextInput style={styles.input} placeholder="Ex: 2000" keyboardType="numeric" value={saidaValue} onChangeText={setSaidaValue} />

          <Text>Categoria</Text>
          <Picker selectedValue={saidaCategoria} onValueChange={setSaidaCategoria} style={styles.picker}>
            {categoriasSaida.map((categoria) => (
              <Picker.Item key={categoria} label={categoria} value={categoria} />
            ))}
          </Picker>
          <Button mode="contained" onPress={adicionarSaida}>Adicionar Saída</Button>
        </View>
      </Modal>


      <Button style={styles.buttonAddEntrada} textColor="rgba(0, 0, 0, 0.53)" onPress={() => setModalEntrada(true)}>cadastrar entrada</Button>
      <View style={styles.containerTransactionsE}>
        <Text style={styles.titleText}>Histórico</Text>

        <FlatList
          data={entradas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={styles.textValueE}>
              {item.value}
            </Text>
          </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.line} />}
        />

      </View>

      <Button style={styles.buttonAddSaida} textColor="rgba(0, 0, 0, 0.53)" onPress={() => setModalSaida(true)}>cadastrar saída</Button>
      <View style={styles.containerTransactionsS}>
        <Text style={styles.titleText}>Histórico</Text>

        <FlatList
          data={saidas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={styles.textValueS}>
              {item.value}
            </Text>
          </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.line} />}
        />
          
      </View>
          
    </View>
  );
};

const styles = StyleSheet.create({
  background:{},
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'transparent',

  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.azul_bebe,
    padding: 35
  },
  overlay:{
    position: "absolute",
  },
  input: {
    backgroundColor: "#FFF",
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    marginBottom: 15
  },
  picker: {
    height: 50,
    width: 250
  },
  containerTransactionsE: {
    flex: 1,
    backgroundColor: colors.branco_gelo,
    borderRadius: 21,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
  },
  containerTransactionsS: {
    flex: 1,
    backgroundColor: colors.branco_gelo,
    borderRadius: 21,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
  },
  itemContainer:{
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    paddingVertical: 10,
  },
  titleText: {
    textAlign:'center',
    marginTop:16,
    fontSize:16,
    fontWeight:'medium'
  },
  itemInfo:{},
  buttonAddEntrada: {
    backgroundColor: colors.verde,
    marginVertical: 25,
    borderRadius: 10,
  },
  buttonAddSaida: {
    backgroundColor: colors.rosa_salmao,
    marginVertical: 25,
    borderRadius: 10,
    
  },
  entradaItem: {
  },
  itemName: {
    fontSize: 16,
    fontWeight: "500",
  },
  itemDate:{
    fontSize: 12,
    color: "gray",
  },
  textValueE:{    
    fontSize: 20,
    color: '#34C759',
  },
  textValueS:{
    fontSize: 20,
    color: 'red',
  },
  line:{
    borderBottomColor: "rgba(0, 0, 0, 0.18)",
    borderBottomWidth: 1,
    marginHorizontal: 10,
  }
});

export default NewExpense;
