import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const diasCurtos = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

export function SeletorDias({ diaSelecionado, totalDias, onSelecionarDia, isDark, textoMuted }: any) {
  const hoje = new Date();
  const diaSemanaHoje = hoje.getDay();
  const distanciaAteSegunda = diaSemanaHoje === 0 ? -6 : 1 - diaSemanaHoje;
  
  const segundaFeira = new Date(hoje);
  segundaFeira.setDate(hoje.getDate() + distanciaAteSegunda);

  return (
    <View style={styles.linhaDias}>
      {diasCurtos.slice(0, totalDias).map((diaStr, index) => {
        const dataDia = new Date(segundaFeira);
        dataDia.setDate(segundaFeira.getDate() + index);
        const numeroDoDia = dataDia.getDate();

        const selecionado = diaSelecionado === index;

        return (
          <TouchableOpacity
            key={diaStr}
            onPress={() => onSelecionarDia(index)}
            activeOpacity={0.8}
            style={[
              styles.botaoDia,
              {
                backgroundColor: selecionado ? (isDark ? '#1F3326' : '#2E4A2E') : (isDark ? '#15251C' : '#F7F3EE'),
              },
            ]}
          >
            <Text style={[styles.textoCurto, { color: selecionado ? '#FAF6F0' : textoMuted }]}>
              {diaStr}
            </Text>
            <Text style={[styles.textoNumero, { color: selecionado ? '#FAF6F0' : (isDark ? '#FAF6F0' : '#2C2016') }]}>
              {numeroDoDia}
            </Text>
            {selecionado && <View style={[styles.pontoHoje, { backgroundColor: '#FAF6F0' }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  linhaDias: { 
    flexDirection: 'row', 
    gap: 6, 
    marginBottom: 18 
  },
  botaoDia: { 
    flex: 1, 
    alignItems: 'center', 
    paddingVertical: 8, 
    borderRadius: 14 
  },
  textoCurto: { 
    fontSize: 11, 
    fontWeight: '600', 
    marginBottom: 5 
  },
  textoNumero: { 
    fontSize: 15, 
    fontWeight: 'bold' 
  },
  pontoHoje: { 
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    marginTop: 4 
  },
});