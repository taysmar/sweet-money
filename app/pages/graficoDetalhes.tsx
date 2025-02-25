import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const DonutChartMeta = ({ reservado, meta }: { reservado: number; meta: number }) => {
    // Calcula a porcentagem de progresso
    const porcentagem = ((reservado / meta) * 100).toFixed(0);

    const pieData = [
        { value: Number(porcentagem), color: "#6FCF97" }, // Verde claro para o progresso
        { value: 100 - Number(porcentagem), color: "#DCEAFF" }, // Azul claro para o fundo
    ];

    return (
        <View style={styles.chartContainer}>
            <PieChart
                donut
                innerRadius={50}
                radius={70}
                data={pieData}
                centerLabelComponent={() => (
                    <Text style={styles.percentageText}>{porcentagem}%</Text>
                )}
            />
        </View>
    );
};


const styles = StyleSheet.create({
    chartContainer: {
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 20,
    },
    percentageText: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
    },
});

export default DonutChartMeta;
