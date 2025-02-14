import { useNavigation } from "@react-navigation/native";
import { Appbar, Button } from 'react-native-paper'
import React from "react";
import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import colors from "./colors";

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content title="sweet money" titleStyle={styles.headerTitle} />
        <Appbar.Action icon="menu" onPress={() => { }} />
      </Appbar.Header>

      <View style={styles.balanceContainer}>
        <Text style={styles.balanceText}>Saldo atual</Text>
        <Text style={styles.balanceAmount}>R$ 300,00</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('NewExpense')}>
          <MaterialIcons name="attach-money" size={30} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Savings')}>
          <MaterialIcons name="savings" size={30} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
          <MaterialIcons name="bar-chart" size={30} color="#4CAF50" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <MaterialIcons name="settings" size={30} color="#4CAF50" />
        </TouchableOpacity>
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D7C4E2',
    padding: 16,
  },
  header: {
    backgroundColor: '#FFB6C1'
  },
  headerTitle: {
    color: colors.branco_gelo
  },
  balanceContainer: {
    backgroundColor: colors.branco_gelo,
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,

  },
  balanceText: {
    fontSize: 16,
  },
  balanceAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.verde
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  }
})

export default Home;