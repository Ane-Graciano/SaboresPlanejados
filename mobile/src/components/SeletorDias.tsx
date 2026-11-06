import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const diasCurtos = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

const gerarDiasCalendario = (totalDias: number) => {
  const lista = [];
  const nomesDias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const dataInicial = new Date(hoje);
  if (totalDias !== 30) {
    const diaSemanaHoje = hoje.getDay();
    const distanciaAteSegunda = diaSemanaHoje === 0 ? -6 : 1 - diaSemanaHoje;
    dataInicial.setDate(hoje.getDate() + distanciaAteSegunda);
  }

  for (let i = 0; i < totalDias; i++) {
    const data = new Date(dataInicial);
    data.setDate(dataInicial.getDate() + i);

    const ehPassado = data < hoje;

    lista.push({
      index: i,
      diaStr: nomesDias[data.getDay()],
      numeroDoDia: data.getDate(),
      dataCompleta: data,
      ehPassado,
    });
  }
  return lista;
};

export function SeletorDias({ diaSelecionado, totalDias, onSelecionarDia, isDark, textoMuted }: any) {
  const itensParaRenderizar = gerarDiasCalendario(totalDias);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const eh30Dias = totalDias === 30;

  return (
    <ScrollView 
      horizontal={eh30Dias} 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={[styles.linhaDias, eh30Dias && styles.scroll30Dias]}
    >
      {itensParaRenderizar.map((item) => {
        const selecionado = diaSelecionado === item.index;
        const ehHojeReal = item.dataCompleta.toDateString() === hoje.toDateString();

        return (
          <TouchableOpacity
            key={item.index}
            onPress={() => onSelecionarDia(item.index)} // <-- Agora permite clicar para ver o passado!
            activeOpacity={0.8}
            style={[
              styles.botaoDia,
              eh30Dias && styles.botaoDia30,
              {
                backgroundColor: selecionado 
                  ? (isDark ? '#1F3326' : '#2E4A2E') 
                  : item.ehPassado 
                    ? (isDark ? '#101A14' : '#F0ECE4') 
                    : (isDark ? '#15251C' : '#F7F3EE'),
                opacity: item.ehPassado && !selecionado ? 0.6 : 1,
                borderColor: ehHojeReal && !selecionado ? (isDark ? '#2E4A2E' : '#6B8C6B') : 'transparent',
                borderWidth: ehHojeReal && !selecionado ? 1.5 : 0,
              },
            ]}
          >
            <Text style={[styles.textoCurto, { color: selecionado ? '#FAF6F0' : textoMuted }]}>
              {item.diaStr}
            </Text>
            <Text style={[styles.textoNumero, { color: selecionado ? '#FAF6F0' : (isDark ? '#FAF6F0' : '#2C2016') }]}>
              {item.numeroDoDia}
            </Text>
            
            {selecionado ? (
              <View style={[styles.pontoHoje, { backgroundColor: '#FAF6F0' }]} />
            ) : ehHojeReal ? (
              <View style={[styles.pontoHoje, { backgroundColor: '#6B8C6B' }]} />
            ) : null}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  linhaDias: { flexDirection: 'row', gap: 6, marginBottom: 18, width: '100%' },
  scroll30Dias: { paddingRight: 10, width: undefined },
  botaoDia: { flex: 1, alignItems: 'center', paddingVertical: 8, borderRadius: 14 },
  botaoDia30: { width: 50, flex: undefined },
  textoCurto: { fontSize: 11, fontWeight: '600', marginBottom: 5 },
  textoNumero: { fontSize: 15, fontWeight: 'bold' },
  pontoHoje: { width: 4, height: 4, borderRadius: 2, marginTop: 4 },
});