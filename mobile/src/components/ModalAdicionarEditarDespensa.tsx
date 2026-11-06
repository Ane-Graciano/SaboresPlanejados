import React, { useState, useEffect } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { CategoriaIngrediente } from '../types/shopping';
import { ItemDespensa } from '../types/pantry';

interface ModalProps {
  visivel: boolean;
  itemParaEditar?: ItemDespensa | null;
  onFechar: () => void;
  onSalvar: (dados: Omit<ItemDespensa, 'id'>) => void;
}

const CATEGORIAS: CategoriaIngrediente[] = [
  'Hortifruti',
  'Carnes',
  'Laticínios',
  'Mercearia',
  'Bebidas',
  'Outros',
];

const UNIDADES = ['unidades', 'unidade', 'g', 'kg', 'ml', 'litro', 'cabeça', 'dentes', 'colheres de sopa', 'fatias'];

const EMOJIS: Record<CategoriaIngrediente, string> = {
  Hortifruti: '🥦',
  Carnes: '🥩',
  Laticínios: '🧀',
  Mercearia: '🌾',
  Bebidas: '🥤',
  Outros: '📦',
};

export function ModalAdicionarEditarDespensa({
  visivel,
  itemParaEditar,
  onFechar,
  onSalvar,
}: ModalProps) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [unidade, setUnidade] = useState('unidades');
  const [categoria, setCategoria] = useState<CategoriaIngrediente>('Outros');

  useEffect(() => {
    if (itemParaEditar) {
      setNome(itemParaEditar.nome);
      setQuantidade(itemParaEditar.quantidade);
      setUnidade(itemParaEditar.unidade);
      setCategoria(itemParaEditar.categoria);
    } else {
      setNome('');
      setQuantidade('1');
      setUnidade('unidades');
      setCategoria('Outros');
    }
  }, [itemParaEditar, visivel]);

  const handleSalvar = () => {
    if (!nome.trim()) return;
    onSalvar({
      nome: nome.trim(),
      quantidade: quantidade.trim() || '1',
      unidade,
      categoria,
    });
    onFechar();
  };

  return (
    <Modal visible={visivel} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.titulo}>
              {itemParaEditar ? 'Editar ingrediente' : 'Adicionar ingrediente'}
            </Text>
            <TouchableOpacity onPress={onFechar} style={styles.botaoFechar}>
              <Feather name="x" size={18} color="#6B5744" />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>INGREDIENTE</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Azeite de oliva"
            placeholderTextColor="#B8A898"
            value={nome}
            onChangeText={setNome}
          />

          <View style={styles.linhaDupla}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>QUANTIDADE</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={quantidade}
                onChangeText={setQuantidade}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.label}>UNIDADE</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollUnidades}>
                {UNIDADES.map((u) => (
                  <TouchableOpacity
                    key={u}
                    onPress={() => setUnidade(u)}
                    style={[styles.chipUnidade, unidade === u && styles.chipUnidadeAtivo]}
                  >
                    <Text style={[styles.textoUnidade, unidade === u && styles.textoUnidadeAtivo]}>
                      {u}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>

          <Text style={styles.label}>CATEGORIA</Text>
          <View style={styles.gridCategorias}>
            {CATEGORIAS.map((cat) => {
              const ativa = categoria === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategoria(cat)}
                  style={[styles.chipCategoria, ativa && styles.chipCategoriaAtiva]}
                >
                  <Text style={{ fontSize: 13 }}>{EMOJIS[cat]}</Text>
                  <Text style={[styles.textoCategoria, ativa && styles.textoCategoriaAtiva]}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity
            style={[styles.botaoSalvar, !nome.trim() && styles.botaoDesabilitado]}
            onPress={handleSalvar}
            disabled={!nome.trim()}
          >
            <Text style={styles.textoSalvar}>Salvar na despensa</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  content: { backgroundColor: '#FAF8F5', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 22 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  titulo: { fontSize: 18, fontWeight: 'bold', color: '#2C2016' },
  botaoFechar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F0EAE0', alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 11, fontWeight: 'bold', color: '#8C7A6B', marginBottom: 6, textTransform: 'uppercase' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#DDD4C8', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#2C2016', marginBottom: 14 },
  linhaDupla: { flexDirection: 'row', gap: 10 },
  scrollUnidades: { flexDirection: 'row', marginBottom: 14 },
  chipUnidade: { paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DDD4C8', marginRight: 6 },
  chipUnidadeAtivo: { backgroundColor: '#2E4A2E', borderColor: '#2E4A2E' },
  textoUnidade: { fontSize: 12, color: '#6B5744' },
  textoUnidadeAtivo: { color: '#FAF6F0', fontWeight: 'bold' },
  gridCategorias: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  chipCategoria: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1.5, borderColor: '#DDD4C8' },
  chipCategoriaAtiva: { backgroundColor: '#2E4A2E', borderColor: '#2E4A2E' },
  textoCategoria: { fontSize: 12, color: '#6B5744', fontWeight: '500' },
  textoCategoriaAtiva: { color: '#FAF6F0', fontWeight: 'bold' },
  botaoSalvar: { backgroundColor: '#2E4A2E', borderRadius: 16, paddingVertical: 14, alignItems: 'center' },
  botaoDesabilitado: { backgroundColor: '#C4B4A4' },
  textoSalvar: { color: '#FAF6F0', fontSize: 15, fontWeight: 'bold' },
});