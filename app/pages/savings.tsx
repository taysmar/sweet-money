import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, TextInput, ScrollView, FlatList, Modal, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import colors from './colors'
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { lucideIcons } from "@/assets/icons/iconList";
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { supabase } from "@/assets/config/supabase";
import Moment from 'moment';
import { addGoal, getGoals } from '@/assets/services/goals'
import DonutChartMeta from './graficoDetalhes'
import { XIcon } from "lucide-react-native";

const Savings = () => {
    const [modalState, setModalState] = useState(false);
    const [nomeMeta, setNomeMeta] = useState('');
    const [valorMeta, setValorMeta] = useState(0);
    const [dataMeta, setDataMeta] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState('');
    const [metas, setMetas] = useState<Meta[]>([]);
    const [iconsState, setIconsState] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState(lucideIcons[0]);
    const [detalesMetaModal, setDetalhesMetaModal] = useState(false);
    const [metaSelecionada, setMetaSelecionada] = useState<Meta | null>(null);
    const [totalReservado, setTotalReservado] = useState(0);

    const toggleModal = () => {
        setModalState(!modalState);
    };

    const abrirDetalhesMeta = (meta: Meta) => {
        setMetaSelecionada(meta);
        setDetalhesMetaModal(true);
    };


    interface Meta {
        id: number;
        goal_name: string;
        target_amount: number;
        saved_amount: number;
        deadline: string;
        icon: string;
    }

    const IconeDinamico = ({ nomeIcone, tamanho = 32, cor = "black" }: { nomeIcone: string; tamanho?: number; cor?: string }) => {
        const iconeEncontrado = lucideIcons.find((icon) => icon.name === nomeIcone);

        if (!iconeEncontrado) {
            return <Text>$</Text>;
        }

        const IconComponent = iconeEncontrado.Icon;
        return <IconComponent size={tamanho} color={cor} />;
    };


    const fetchMetas = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
            return;
        }
        const userId = userData.user.id;
        try {
            const metasData = await getGoals(userId) || [];
            setMetas(metasData);

            const total = metasData.reduce((acc, item) => acc + (item.saved_amount || 0), 0);
            setTotalReservado(total); 

        } catch (error) {
        }
    };

    useEffect(() => {
        fetchMetas();
    }, []);

    const onDayPress = useCallback((day: { dateString: React.SetStateAction<string>; }) => {
        setSelectedDate(day.dateString);
        Moment.locale('pt-br')
    }, []);

    const markedDates = useMemo(() => ({
        [selectedDate]: {
            selected: true,
            selectedColor: colors.roxo,
            selectedTextColor: "#FFF"
        }
    }), [selectedDate]);

    const salvarMeta = async () => {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) return console.log('Erro ao obter usuário:', userError);

        const userId = userData.user.id;

        if (!nomeMeta || !valorMeta || !selectedDate) {
            return console.log("Preencha todos os campos antes de salvar.");
        }

        try {
            await addGoal(userId, nomeMeta, Number(valorMeta), selectedDate, selectedIcon.name);
            setModalState(false);
            fetchMetas();
        } catch (error) {
            console.error("Erro ao salvar meta:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Modal animationType="slide" transparent={true} visible={modalState} onRequestClose={() => setModalState(false)} >
                <View style={styles.cadastroMetaContainer}>
                    <KeyboardAwareScrollView>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalState(false)}>
                            <Text style={{ fontSize: 22 }}>X</Text>
                        </TouchableOpacity>
                        <Text style={styles.tituloCadastroMeta}>Qual meta quer colocar no forno?</Text>
                        <Text style={styles.textoCadastroMeta}>Escolha um ícone que melhor representa a sua meta</Text>
                        <TouchableOpacity onPress={() => setIconsState(true)} style={styles.iconWrapper}>
                            <selectedIcon.Icon size={50} color={colors.roxo} />
                        </TouchableOpacity>

                        <Text style={styles.inputHeader}>Nome da meta</Text>
                        <TextInput
                            style={styles.input}
                            value={nomeMeta}
                            onChangeText={setNomeMeta}
                        ></TextInput>

                        <Text style={styles.inputHeader}>Valor da meta</Text>
                        <TextInput
                            style={styles.input}
                            value={valorMeta.toString()}
                            onChangeText={(text) => {
                                if (!isNaN(Number(text))) setValorMeta(Number(text));
                            }}
                            keyboardType="numeric"
                        ></TextInput>

                        <Text style={styles.inputHeader}>Data para bater a meta</Text>
                        <Calendar
                            enableSwipeMonths
                            onDayPress={onDayPress}
                            markedDates={markedDates}
                            theme={{
                                backgroundColor: colors.branco_gelo,
                                calendarBackground: colors.branco_gelo,
                                todayTextColor: colors.azul_bebe,
                                arrowColor: colors.azul_bebe,
                                selectedDayBackgroundColor: colors.roxo,
                                selectedDayTextColor: "#FFF",
                                monthTextColor: colors.rosa_salmao,
                                textDisabledColor: "#D3D3D3",
                            }}
                        />
                        {selectedDate && (
                            <Text style={styles.selectedDateText}>Vai ser muito legal te ajudar até  {Moment(selectedDate).format('DD/MM/YYYY')}</Text>
                        )}
                        <TouchableOpacity style={styles.button} onPress={salvarMeta}>
                            <Text style={styles.buttonText}>Mandar para o forno</Text>
                        </TouchableOpacity>

                    </KeyboardAwareScrollView>
                </View>
            </Modal>

            <Modal animationType="fade" transparent visible={iconsState} onRequestClose={() => setIconsState(false)}>
                <View style={styles.speechBubble}>
                    <View style={styles.allIcons}>
                        {lucideIcons.map((item) => (
                            <TouchableOpacity
                                key={item.name}
                                style={styles.iconContainer}
                                onPress={() => {
                                    setSelectedIcon(item);
                                    setIconsState(false);
                                }}>
                                <item.Icon size={40} color={colors.rosa_salmao} />
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </Modal>

            <Modal animationType="slide" transparent visible={detalesMetaModal} onRequestClose={() => setDetalhesMetaModal(false)}>
                {metaSelecionada && (
                    <View style={styles.detalhesModal}>
                        <Text style={styles.detalhesTitle}>A meta está no forno!</Text>

                        <View style={styles.detalhesMetaitensContainer}>

                            <IconeDinamico nomeIcone={metaSelecionada.icon} tamanho={40} cor={colors.roxo} />
                            <Text style={styles.modalTitle}>{metaSelecionada.goal_name}</Text>
                        </View>
                        <View style={styles.graphicContainer}>
                            <Text style={styles.graphicTitle}>A receita está dando certo! Aqui está a porcentagem do valor reservado.</Text>
                            <DonutChartMeta reservado={metaSelecionada.saved_amount} meta={metaSelecionada.target_amount} />

                        </View>
                        <View style={styles.valorContainer}>
                            <Text style={styles.label}>Valor reservado</Text>
                            <Text style={styles.valor}>R$ {metaSelecionada.saved_amount}</Text>
                        </View>

                        <View style={styles.valorContainer}>
                            <Text style={styles.label}>Meta</Text>
                            <Text style={styles.valor}>R$ {metaSelecionada.target_amount}</Text>
                        </View>

                        <Button style={styles.closeButton} onPress={() => setDetalhesMetaModal(false)}>
                            <XIcon color={colors.roxo} />
                        </Button>

                    </View>
                )}
            </Modal>

            {!modalState && !detalesMetaModal && (
                <View style={styles.metasContainer}>
                    <View style={styles.totalContainer}>
                        <Text style={styles.totalTitle}>Total reservado</Text>
                        <Text style={styles.totalValue}>R$ {totalReservado}</Text>
                    </View>
                    <Button
                        style={styles.addMetaButton}
                        textColor="rgba(0,0,0,0.53)"
                        onPress={() => setModalState(true)}>Cadastrar meta</Button>

                    <FlatList
                        data={metas}
                        horizontal={false}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity onPress={() => abrirDetalhesMeta(item)}>
                                <View style={styles.itemContainer}>
                                    <View style={styles.iconETitleContainer}>
                                        <IconeDinamico nomeIcone={item.icon} tamanho={37} cor={colors.roxo} />
                                        <Text style={styles.itemTitle}>{item.goal_name}</Text>
                                    </View>
                                    <View style={styles.valueContainer}>
                                        <Text style={styles.itemValue}> R$ {item.target_amount}</Text>

                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />

                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        alignItems: 'center',


    },
    metasContainer: {

    },
    iconETitleContainer: {
        flexDirection: 'row',
        width: '40%',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    valueContainer: {
        flexDirection: 'row',
        width: '60%',
        justifyContent: 'space-around',

    },
    totalContainer: {
        width: 350,
        height: 85,
        backgroundColor: colors.branco_gelo,
        marginVertical: 45,
        marginHorizontal: 18,
        borderRadius: 10,
        alignItems: 'flex-end',
        padding: 15,
        marginBottom: 10,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 2,
        elevation: 6,
    },
    metaContainer: {
        flex: 1
    },
    totalTitle: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.53)'
    },
    totalValue: {
        padding: 4,
        color: '#34C759',
        fontSize: 25,
    },
    addMetaButton: {
        backgroundColor: colors.verde,
        height: 45,
        marginHorizontal: 100,
        marginVertical: 20,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    itemContainer: {
        backgroundColor: colors.branco_gelo,
        marginVertical: 16,
        borderRadius: 10,
        padding: 15,
        marginHorizontal: 18,
        marginBottom: 10,
        shadowOffset: { width: 10, height: 10 },
        shadowColor: 'black',
        shadowOpacity: 2,
        elevation: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    closeButton: {
        position: 'absolute',
        right: 5,
        alignItems: 'flex-end',

    },
    cadastroMetaContainer: {
        backgroundColor: colors.branco_gelo,
        padding: 20,
        width: "90%",
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        alignItems: "center",
        marginTop: 70,
        marginBottom: 80,
        marginHorizontal: 20
    },
    tituloCadastroMeta: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginVertical: 28,
    },
    textoCadastroMeta: {
        fontSize: 12.81,
        paddingHorizontal: 60,
        paddingVertical: 30,
        textAlign: 'center',

    },
    iconeEscolhido: {

    },
    input: {
        borderColor: colors.roxo,
        height: 46,
        borderWidth: 1,
        width: 285,
        marginVertical: 18,
        borderRadius: 8.01

    },
    inputHeader: {
    },
    button: {
        backgroundColor: colors.verde,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        marginVertical: 45,
        marginHorizontal: 40,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center'


    },
    buttonText: {
        fontSize: 16,
        color: 'rgba(0,0,0,0.53)',
        textAlign: 'center',

    },
    speechBubble: {
        position: "absolute",
        top: "42%",
        left: "25%",
        width: 200,
        backgroundColor: colors.branco_gelo,
        borderRadius: 15,
        padding: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 5,
        alignItems: "center",
    },
    iconContainer: {
        margin: 10,
        alignItems: "center",
    },
    iconWrapper: {
        backgroundColor: colors.branco_gelo,
        padding: 15,
        height: 90,
        borderRadius: 110,
        borderWidth: 1,
        marginHorizontal: 100,
        borderColor: colors.roxo,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 15
    },

    allIcons: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
    },
    itemTitle: {
        fontSize: 16,
        width: '70%',
        textAlign: 'right'
    },
    itemValue: {
        fontSize: 20,
        color: '#34C759',
        width: '70%',
        textAlign: 'right',
        marginRight: 5

    },
    itemDeadline: {

    },
    selectedDateText: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.53)',
        marginTop: 10,
        textAlign: 'center'
    },
    itemIcon: {

    },
    detalhesModal: {
        backgroundColor: colors.branco_gelo,
        flex: 1,
        width: '90%',
        marginHorizontal: 19,
        marginVertical: 110,
        borderRadius: 10,
        alignItems: 'center',
        paddingVertical: 35,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    detalhesTitle: {
        fontSize: 16,
        color: colors.preto_suave,
    },
    modalTitle: {
        margin: 10,
        fontSize: 16,
        color: colors.preto_suave,

    },
    modalValue: {

    },
    modalDeadline: {

    },
    detalhesMetaitensContainer: {
        flexDirection: 'row',
        margin: 10,
        alignItems: 'center',
    },
    graphicContainer: {
        marginHorizontal: 55
    },
    graphicTitle: {
        color: colors.preto_suave,
    },
    valorContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "85%",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: "white",
        borderRadius: 12,
        marginVertical: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
    },
    label: {
        fontSize: 16,
        color: "#666",
    },
    valor: {
        fontSize: 16,
        color: "#34C759",
    },
});
export default Savings;
