import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import colors from "./colors";

const History = () => {
      const navigation = useNavigation();

      const Expenses = () => {
        const [saidas, setSaidas] = useState([]);
        const [entradas, setEntradas] = useState([]);
        
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
      }
return (
    <SafeAreaView style={styles.historyContainer}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Histórico</Text>
          </View>
          <View style={styles.itemContainer}>

            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>entrada</Text>
              <Text style={styles.itemData}>17/02/2025</Text>
            </View>
            <View style={styles.itemValue} >
              <Text style={styles.itemTextValue}>100</Text>

            </View>
          </View>
            <View style={styles.line}></View>
    </SafeAreaView>
    )

}

const styles = StyleSheet.create({

    historyContainer:{
        flex: 2,
        backgroundColor: colors.branco_gelo,
        marginHorizontal: 19,
        marginVertical:10,
        borderRadius: 21,
        
    },
    historyHeader:{
        alignItems: 'center',
        marginTop: 10,
        
    },
    historyTitle:{
        fontSize: 16,
        fontWeight: 'bold'
    },
    itemContainer:{
        flexDirection: 'row',
        flexWrap: 'wrap-reverse',
        justifyContent: 'space-between',
        marginHorizontal: 28,
        marginVertical: 14        
    },
    itemInfo:{
    },
    itemName:{
        fontSize: 16
    },
    itemData:{
        fontSize: 12
    },
    itemValue:{
    },
    itemTextValue:{
        fontSize: 20
    },
    line:{
        borderBottomColor: 'rgba(0, 0, 0, 0.18)',
        borderBottomWidth: 1,
        marginHorizontal:10,
        borderStartEndRadius: 2,
        
    }

})

export default History;