import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, FlatList, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import colors from "./colors";
import { supabase } from "@/assets/config/supabase";
import { Edit, Edit2Icon, EditIcon, XIcon } from "lucide-react-native";

const NewExpense = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [modalEntrada, setModalEntrada] = useState(false);
  const [modalSaida, setModalSaida] = useState(false);

  const [entradaName, setEntradaName] = useState("");
  const [entradaValue, setEntradaValue] = useState("");
  const [entradaCategoria, setEntradaCategoria] = useState("");

  const [saidaName, setSaidaName] = useState("");
  const [saidaValue, setSaidaValue] = useState("");
  const [saidaCategoria, setSaidaCategoria] = useState("");

  const [entradas, setEntradas] = useState<Transaction[]>([]);
  const [saidas, setSaidas] = useState<Transaction[]>([]);

  const categoriasEntrada = ["Salário", "Freelance", "Outros"];
  const categoriasSaida = ["Aluguel", "Alimentação", "Transporte", "Casa"];
  const [editModalState, setEditModalState] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editCategory, setEditCategory] = useState('');

  type Transaction = {
    transaction_id: string;
    client_id: string;
    amount: number;
    type: "entrada" | "saida";
    category: string;
    description: string;
    date: string;
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
    if (!userId) return;
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("client_id", userId);

    if (error) {
      console.error("Erro ao carregar transações:", error);
      return;
    }
    setEntradas(data.filter((t: Transaction) => t.type === "entrada"));
    setSaidas(data.filter((t: Transaction) => t.type === "saida"));
  };

  useEffect(() => {
    if (userId) loadTransactions();
  }, [userId]);

  const openModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditModalState(true);
    setEditName(transaction.description || "");
    setEditValue(transaction.amount ? transaction.amount.toString() : "");
  };

  const updateTransaction = async () => {
    if (!selectedTransaction) return;
    const { error } = await supabase
      .from("transactions")
      .update({
        description: editName,
        amount: parseFloat(editValue),
        category: editCategory,
      })
      .eq("transaction_id", selectedTransaction.transaction_id);

    if (error) {
      console.error("Erro ao atualizar transação:", error);
      Alert.alert("Erro", "Não foi possível atualizar a transação.");
      return;
    }

    Alert.alert("Sucesso", "Transação atualizada!");
    setEditModalState(false);
    loadTransactions();
  };


  const deleteTransaction = async () => {
    if (!selectedTransaction) {
      console.error("Nenhuma transação selecionada para excluir.");
      return;
    }


    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("transaction_id", selectedTransaction.transaction_id);

    if (error) {
      console.error("Erro ao excluir transação:", error);
      Alert.alert("Erro", "Não foi possível excluir a transação.");
      return;
    }

    Alert.alert("Sucesso", "Transação excluída!");
    setEditModalState(false);
    loadTransactions();
  };

  const addTransaction = async (type: "entrada" | "saida", name: string, value: string, category: string) => {
    if (!userId || !name.trim() || !value.trim() || !category.trim()) {
      Alert.alert('Ei, você esqueceu de preencher alguma coisa :c')
      return;
    } 

    const newTransaction = {
      client_id: userId,
      amount: parseFloat(value),
      type,
      category,
      description: name,
      date: format(new Date(), "yyyy-MM-dd"),
    };

    const { error } = await supabase.from("transactions").insert([newTransaction]);

    if (error) {
      console.error("Erro ao salvar transação no Supabase:", error);
      return;
    }
    loadTransactions();

    if (type === "entrada") {
      setModalEntrada(false);
    }

    if (type === "saida") {
      setModalSaida(false);
    }
  };


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.buttonEntrada} onPress={() => setModalEntrada(true)}>
        <Text style={styles.buttonText}>Cadastrar Entrada</Text>
      </TouchableOpacity>


      <FlatList
        contentContainerStyle={{ backgroundColor: colors.branco_gelo, width:300, borderRadius:21, minHeight:140, shadowOffset: { width: 10, height: 10 },
        shadowColor: colors.preto_suave, shadowOpacity: 2, elevation: 4,shadowRadius:21, marginBottom:30}}
        data={entradas}
        horizontal={false}
        keyExtractor={(item) => item.transaction_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>{item.description}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={[styles.itemValue, styles.entrada]}>+ R$ {item.amount.toFixed(2)}</Text>
            <Edit color={'green'} onPress={() => openModal(item)} />
          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.line} /> }
      />


      <TouchableOpacity style={styles.buttonSaida} onPress={() => setModalSaida(true)}>
        <Text style={styles.buttonText}>Cadastrar Saída</Text>
      </TouchableOpacity>

      <FlatList
        contentContainerStyle={{ backgroundColor: colors.branco_gelo, width:300, borderRadius:21, minHeight:160, shadowOffset: { width: 15, height: 15 },
        shadowColor: colors.preto_suave, shadowOpacity: 1, elevation: 3,}}
        data={saidas}
        scrollEnabled={true}
        keyExtractor={(item) => item.transaction_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View>
              <Text style={styles.itemName}>{item.description}</Text>
              <Text style={styles.itemDate}>{item.date}</Text>
            </View>
            <Text style={[styles.itemValue, styles.saida]}>- R$ {item.amount.toFixed(2)}</Text>
            <Edit color={'red'} onPress={() => openModal(item)} />

          </View>
        )}
        ItemSeparatorComponent={() => <View style={styles.line} /> }
      />


      {/* Modais */}
      <Modal animationType="slide" transparent visible={modalEntrada} onRequestClose={() => setModalEntrada(false)}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>Nova Entrada</Text>
            <TextInput style={styles.input} placeholder="Ex: Salário" value={entradaName} onChangeText={setEntradaName} />
            <TextInput style={styles.input} placeholder="Valor (R$)" keyboardType="numeric" value={entradaValue} onChangeText={setEntradaValue} />
            <Picker selectedValue={entradaCategoria} onValueChange={setEntradaCategoria} style={styles.picker}>
            <Picker.Item label="" value={-1} />
              {categoriasEntrada.map((categoria) => <Picker.Item key={categoria} label={categoria} value={categoria} />)}
            </Picker>
            <Button style={styles.buttonNovaEntrada} textColor={colors.preto_suave} onPress={() => addTransaction("entrada", entradaName, entradaValue, entradaCategoria)}>Adicionar</Button>
          </ScrollView>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={modalSaida} onRequestClose={() => setModalSaida(false)}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.modalTitle}>Nova Saída</Text>
            <TextInput style={styles.input} placeholder="Ex: Aluguel" value={saidaName} onChangeText={setSaidaName} />
            <TextInput style={styles.input} placeholder="Valor (R$)" keyboardType="numeric" value={saidaValue} onChangeText={setSaidaValue} />
            <Picker selectedValue={saidaCategoria} onValueChange={setSaidaCategoria} style={styles.picker}>
              <Picker.Item label="" value={-1} />
              {categoriasSaida.map((categoria) => <Picker.Item key={categoria} label={categoria} value={categoria} />)}
            </Picker>
            <Button style={styles.buttonNovaSaida} textColor={colors.branco_gelo}  onPress={() => addTransaction("saida", saidaName, saidaValue, saidaCategoria)}>Adicionar</Button>
          </ScrollView>
        </View>
      </Modal>

      <Modal animationType="slide" transparent={true} visible={editModalState} onRequestClose={() => setEditModalState(false)}>
        <View style={styles.modalEditContainer}>
          <View style={styles.editHeader}>
            <Text style={styles.editTitle}>Edição de valores</Text>
            <XIcon color={colors.roxo} onPress={() => setEditModalState(false)} />
          </View>
          <View>
            <ScrollView>
              <TextInput style={styles.input} value={editName} onChangeText={setEditName} />
              <TextInput style={styles.input} keyboardType="numeric" value={editValue} onChangeText={setEditValue} />
              <Picker selectedValue={editCategory} onValueChange={setEditCategory} style={styles.picker}>
                <Picker.Item value={-1} label="" />
                {categoriasSaida.map((categoria) => <Picker.Item key={categoria} label={categoria} value={categoria} />)}
              </Picker>
              <View style={styles.BtContainer}>
                <Button style={styles.BtEdit} textColor={colors.branco_gelo} onPress={() => updateTransaction()}>Editar</Button>
                <Button style={styles.BtDel} textColor={colors.branco_gelo} onPress={() => deleteTransaction()}>Excluir</Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingVertical: 30, width:'90%', justifyContent:'center', alignSelf:'center' },
  buttonEntrada: { backgroundColor: colors.verde, width:155, height:40, borderRadius:10, justifyContent:'center', marginVertical:16, shadowOffset: { width: 15, height: 15 },
  shadowColor: 'black', shadowOpacity: 1, elevation: 8,},
  buttonSaida: { backgroundColor: colors.rosa_salmao, width:155, height:40, borderRadius:10, justifyContent:'center', marginVertical:16, shadowOffset: { width: 15, height: 15 },
  shadowColor: 'black', shadowOpacity: 1, elevation: 8, },
  buttonText: { color: "#FFF", fontWeight: "bold", textAlign:'center'},
  itemContainer: { flexDirection: "row", justifyContent:'space-between', marginHorizontal:20, marginTop:20, marginBottom:8 },
  itemName: { fontSize: 16, fontWeight: "500" },
  itemDate: { fontSize: 12, color: "gray" },
  itemValue: { fontSize: 18, fontWeight: "bold" },
  entrada: { color: "green" },
  saida: { color: "red" },
  modalContainer: { flex: 1, backgroundColor: "#FFF", width:"80%", alignContent:'center', alignSelf:'center', margin:20, borderRadius: 21, padding:25 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign:'center',  },
  input: { borderWidth: 1, borderColor: colors.roxo, padding: 10, borderRadius: 8, marginVertical: 10 },
  picker: {},
  buttonNovaSaida:{backgroundColor: colors.rosa_salmao, },
  buttonNovaEntrada:{backgroundColor:colors.verde},
  modalEditContainer: { flex: 1, backgroundColor: "#FFF", width:"80%", alignContent:'center', alignSelf:'center', margin:20, borderRadius: 21, padding:25  },
  editHeader: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: 20, marginVertical: 10,  },
  editTitle:{fontSize:18, fontWeight:'bold', },
  line: {borderBottomColor: "rgba(0, 0, 0, 0.18)", borderBottomWidth: 1, marginHorizontal: 12,},
  BtEdit:{backgroundColor:colors.rosa_salmao, width:120},
  BtDel:{backgroundColor:colors.preto_suave, width:120 },
  BtContainer:{flexDirection:'row', justifyContent:'space-between', marginTop:20 },
});

export default NewExpense;
