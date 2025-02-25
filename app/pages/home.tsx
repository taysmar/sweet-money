import { useNavigation } from "@react-navigation/native";
import { Appbar, Button } from 'react-native-paper'
import React from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import colors from "./colors";
import History from "./history";

type RootStackParamList = {
  Home: undefined;
  Savings: undefined;
  Stats: undefined;
  NewExpense: undefined;
  Settings: undefined;
  Login: undefined;
};

export default function Home() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();


  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="sweet money" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="menu" iconColor={colors.branco_gelo} onPress={() => { }} />
      </Appbar.Header>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Saldo atual</Text>
        <Text style={styles.balanceAmount}>R$ 300,00</Text>
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
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <MaterialIcons name="login" size={30} style={styles.iconButton} />
        </TouchableOpacity>
      </View>
      <SafeAreaView style={styles.historyContainer}>
        <History />
      </SafeAreaView>
      <View style={styles.buttonContainer}>
        <Button style={styles.button} onPress={() => { }}>
          Detalhes
        </Button>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,

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
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 11,
    alignItems: 'stretch',
  },
  historyContainer: {
    flex: 1,
    backgroundColor: colors.branco_gelo,
    marginHorizontal: 19,
    marginVertical: 10,
    borderRadius: 21,
    shadowOffset: { width: 10, height: 10 },
    shadowColor: 'black',
    shadowOpacity: 2,
    elevation: 6,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 15,

  },
  button: {
    width: 155,
    height: 41,
    backgroundColor: colors.verde,
    borderRadius: 10,
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
  }

})

