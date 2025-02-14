import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import colors from './colors'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Header } from "@react-navigation/stack";

const Savings = () => {
    const [goalName, setGoalName] = useState('');
    const [goalAmount, setGoalAmount] = useState('');
    const [visible, setVisible] = useState(false);
    const [goals, setGoals] = useState<Goal[]>([]);
    const navigation = useNavigation();

    interface Goal {
        id: string;
        name: string;
        amount: string;
    }

    const saveGoalsToStorage = async (goals: Goal[]) => {
        try {
            await AsyncStorage.setItem('goals', JSON.stringify(goals));
            console.log('Metas salvas:', goals); // Verificar no console
        } catch (error) {
            console.error('Erro ao salvar metas:', error);
        }
    };

    const handleSaveGoal = async () => {
        if (!goalName || !goalAmount) return;

        const newGoal: Goal = { id: Date.now().toString(), name: goalName, amount: goalAmount };
        const updatedGoals = [...goals, newGoal];

        setGoals(updatedGoals); // Atualiza o estado
        await saveGoalsToStorage(updatedGoals); // 🔹 Agora os dados são salvos corretamente!

        setGoalName('');
        setGoalAmount('');
        setVisible(true);
    };

    const loadGoalsFromStorage = async () => {
        try {
            const storedGoals = await AsyncStorage.getItem('goals');
            if (storedGoals) {
                setGoals(JSON.parse(storedGoals));
                console.log('Metas carregadas:', JSON.parse(storedGoals)); // 🔹 Verificar no console
            }
        } catch (error) {
            console.error('Erro ao carregar metas:', error);
        }
    };

    useEffect(() => {
        loadGoalsFromStorage();
    }, []);


    return (
        <View style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.label}>Nome da Meta</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: Viagem, Curso, Carro"
                    value={goalName}
                    onChangeText={setGoalName}
                />

                <Text style={styles.label}>Valor Desejado (R$)</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Ex: 5000"
                    keyboardType="numeric"
                    value={goalAmount}
                    onChangeText={setGoalAmount}
                />
            </View>

            <Button mode="contained" style={styles.saveButton} onPress={handleSaveGoal}>
                Salvar Meta
            </Button>

            <FlatList data={goals}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.goalItem}>
                        <Text style={styles.goalText}>{item.name} - R$ {item.amount}</Text>
                    </View>
                )} />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.rosa_salmao,
        padding: 16,
    },
    header: {
        backgroundColor: colors.azul_bebe,
    },
    headerTitle: {
        color: 'white',
        fontWeight: 'bold',
    },
    formContainer: {
        marginVertical: 20,
    },
    label: {
        fontSize: 16,
        color: colors.branco_gelo,
        marginBottom: 5,
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
    snackbar: {
        backgroundColor: colors.verde,
    },
    goalItem: {

    },
    goalText: {

    }
});
export default Savings;
