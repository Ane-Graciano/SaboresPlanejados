import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, TouchableWithoutFeedback } from 'react-native';

const PRESETS = [
  { label: '1 min', seconds: 60 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '15 min', seconds: 900 },
  { label: '30 min', seconds: 1800 },
];

interface ModalNovoTimerProps {
  visible: boolean;
  onClose: () => void;
  onCriar: (nome: string, totalSegundos: number) => void;
  isDark?: boolean;
}

export function ModalNovoTimer({ visible, onClose, onCriar, isDark }: ModalNovoTimerProps) {
  const [timerName, setTimerName] = useState('');
  const [minutes, setMinutes] = useState('5');
  const [seconds, setSeconds] = useState('0');
  const [formError, setFormError] = useState('');

  const aplicarPreset = (sec: number) => {
    setMinutes(String(Math.floor(sec / 60)));
    setSeconds(String(sec % 60));
    setFormError('');
  };

  const handleCriar = () => {
    const m = parseInt(minutes) || 0;
    const s = parseInt(seconds) || 0;
    const total = m * 60 + s;

    if (total <= 0) {
      setFormError('Defina um tempo maior que zero.');
      return;
    }

    onCriar(timerName, total);
    setTimerName('');
    setMinutes('5');
    setSeconds('0');
    setFormError('');
    onClose();
  };

  const cardBg = isDark ? '#1F3326' : '#FFFFFF';
  const themeText = isDark ? '#FAF6F0' : '#2C2016';
  const themeMuted = isDark ? '#A09386' : '#8C7A6B';
  const themeBorder = isDark ? '#233A2C' : '#DDD4C8';

  const totalAtual = (parseInt(minutes) || 0) * 60 + (parseInt(seconds) || 0);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.modalContent, { backgroundColor: cardBg }]}>
              <View style={styles.handle} />
              <Text style={[styles.tituloModal, { color: themeText }]}>Novo timer</Text>

              {/* Nome */}
              <View style={styles.grupoCampo}>
                <Text style={[styles.rotulo, { color: themeMuted }]}>NOME</Text>
                <TextInput
                  placeholder="Ex: Forno, Molho, Massa…"
                  placeholderTextColor="#C4B4A4"
                  value={timerName}
                  onChangeText={setTimerName}
                  style={[styles.input, { borderColor: themeBorder, color: themeText }]}
                />
              </View>

              {/* Tempo Rápido */}
              <View style={styles.grupoCampo}>
                <Text style={[styles.rotulo, { color: themeMuted }]}>TEMPO RÁPIDO</Text>
                <View style={styles.linhaPresets}>
                  {PRESETS.map((p) => {
                    const selected = totalAtual === p.seconds;
                    return (
                      <TouchableOpacity
                        key={p.label}
                        onPress={() => aplicarPreset(p.seconds)}
                        style={[
                          styles.botaoPreset,
                          {
                            backgroundColor: selected ? '#2E4A2E' : 'transparent',
                            borderColor: selected ? 'transparent' : themeBorder,
                          },
                        ]}
                      >
                        <Text style={{ color: selected ? '#FAF6F0' : themeText, fontSize: 12, fontWeight: selected ? 'bold' : 'normal' }}>
                          {p.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Spinners Minutos / Segundos */}
              <View style={styles.grupoCampo}>
                <Text style={[styles.rotulo, { color: themeMuted }]}>TEMPO PERSONALIZADO</Text>
                <View style={styles.linhaTempoPersonalizado}>
                  {/* Minutos */}
                  <View style={styles.blocoTempo}>
                    <Text style={styles.rotuloSub}>MIN</Text>
                    <View style={[styles.caixaControle, { borderColor: themeBorder }]}>
                      <TouchableOpacity onPress={() => setMinutes((m) => String(Math.max(0, (parseInt(m) || 0) - 1)))}>
                        <Text style={[styles.btnControle, { color: themeText }]}>−</Text>
                      </TouchableOpacity>
                      <TextInput
                        keyboardType="numeric"
                        value={minutes}
                        onChangeText={(v) => { setMinutes(v); setFormError(''); }}
                        style={[styles.inputNumerico, { color: themeText }]}
                      />
                      <TouchableOpacity onPress={() => setMinutes((m) => String(Math.min(99, (parseInt(m) || 0) + 1)))}>
                        <Text style={[styles.btnControle, { color: themeText }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={styles.separadorTempo}>:</Text>

                  {/* Segundos */}
                  <View style={styles.blocoTempo}>
                    <Text style={styles.rotuloSub}>SEG</Text>
                    <View style={[styles.caixaControle, { borderColor: themeBorder }]}>
                      <TouchableOpacity onPress={() => setSeconds((s) => String(Math.max(0, (parseInt(s) || 0) - 5)))}>
                        <Text style={[styles.btnControle, { color: themeText }]}>−</Text>
                      </TouchableOpacity>
                      <TextInput
                        keyboardType="numeric"
                        value={seconds}
                        onChangeText={(v) => { setSeconds(v); setFormError(''); }}
                        style={[styles.inputNumerico, { color: themeText }]}
                      />
                      <TouchableOpacity onPress={() => setSeconds((s) => String(Math.min(59, (parseInt(s) || 0) + 5)))}>
                        <Text style={[styles.btnControle, { color: themeText }]}>+</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {formError ? <Text style={styles.textoErro}>{formError}</Text> : null}

              {/* Botões de Ação */}
              <TouchableOpacity style={styles.btnCriar} onPress={handleCriar}>
                <Text style={styles.txtCriar}>Iniciar timer</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.btnCancelar, { borderColor: themeBorder }]} onPress={onClose}>
                <Text style={[styles.txtCancelar, { color: themeMuted }]}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22, paddingBottom: 40 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: '#DDD4C8', alignSelf: 'center', marginBottom: 20 },
  tituloModal: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  grupoCampo: { marginBottom: 18 },
  rotulo: { fontSize: 11, fontWeight: 'bold', letterSpacing: 1, marginBottom: 8 },
  input: { borderWidth: 1.5, borderRadius: 14, padding: 12, fontSize: 15 },
  linhaPresets: { flexDirection: 'row', gap: 6 },
  botaoPreset: { flex: 1, paddingVertical: 8, borderRadius: 10, borderWidth: 1.5, alignItems: 'center' },
  linhaTempoPersonalizado: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  blocoTempo: { flex: 1 },
  rotuloSub: { fontSize: 10, fontWeight: 'bold', color: '#B8A898', textAlign: 'center', marginBottom: 4 },
  caixaControle: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: 14, height: 48 },
  btnControle: { fontSize: 22, fontWeight: 'bold', paddingHorizontal: 14 },
  inputNumerico: { flex: 1, textAlign: 'center', fontSize: 20, fontWeight: 'bold' },
  separadorTempo: { fontSize: 24, fontWeight: 'bold', color: '#C4B4A4', marginTop: 16 },
  textoErro: { color: '#C46B3E', fontSize: 12, fontWeight: '600', marginBottom: 10 },
  btnCriar: { backgroundColor: '#2E4A2E', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 10 },
  txtCriar: { color: '#FAF6F0', fontSize: 16, fontWeight: 'bold' },
  btnCancelar: { borderWidth: 1.5, borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 8 },
  txtCancelar: { fontSize: 15, fontWeight: '600' },
});