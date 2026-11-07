
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import {
  CategoriaIngrediente,
  ItemListaCompras,
} from '../types/shopping';

const CATEGORIAS: { nome: CategoriaIngrediente; emoji: string }[] = [
  { nome: 'Hortifruti', emoji: '🥦' },
  { nome: 'Carnes', emoji: '🥩' },
  { nome: 'Laticínios', emoji: '🧀' },
  { nome: 'Mercearia', emoji: '🌾' },
  { nome: 'Bebidas', emoji: '🥤' },
  { nome: 'Outros', emoji: '🛒' },
];

interface ModalProps {
  visivel: boolean;
  itemParaEditar?: ItemListaCompras | null;
  onFechar: () => void;
  onSalvar: (
    item: Omit<ItemListaCompras, 'id' | 'comprado' | 'lojaId'>
  ) => void;
}

export function ModalAdicionarEditarItem({
  visivel,
  itemParaEditar,
  onFechar,
  onSalvar,
}: ModalProps) {
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('1');
  const [unidade, setUnidade] = useState('unidades');
  const [categoria, setCategoria] =
    useState<CategoriaIngrediente>('Outros');
  const [imagemUri, setImagemUri] = useState<string | undefined>();

  useEffect(() => {
    if (itemParaEditar) {
      setNome(itemParaEditar.nome);
      setQuantidade(itemParaEditar.quantidade);
      setUnidade(itemParaEditar.unidade);
      setCategoria(itemParaEditar.categoria);
      setImagemUri(itemParaEditar.imagemUri);
    } else {
      setNome('');
      setQuantidade('1');
      setUnidade('unidades');
      setCategoria('Outros');
      setImagemUri(undefined);
    }
  }, [itemParaEditar, visivel]);

  const selecionarFoto = async () => {
    try {
      const permissao =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissao.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria para adicionar uma foto.'
        );
        return;
      }

      const resultado = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!resultado.canceled && resultado.assets.length > 0) {
        setImagemUri(resultado.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  const handleConfirmar = () => {
    if (!nome.trim()) return;

    onSalvar({
      nome: nome.trim(),
      quantidade: quantidade.trim() || '1',
      unidade: unidade.trim() || 'unidade',
      categoria,
      imagemUri,
    });

    onFechar();
  };

  return (
    <Modal visible={visivel} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.titulo}>
              {itemParaEditar ? 'Editar item' : 'Adicionar item'}
            </Text>

            <TouchableOpacity
              onPress={onFechar}
              style={styles.botaoFechar}
            >
              <Feather name="x" size={18} color="#6B5744" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>PRODUTO</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Azeite de oliva"
              placeholderTextColor="#A09386"
              value={nome}
              onChangeText={setNome}
            />

            <View style={styles.linhaDupla}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>QUANTIDADE</Text>
                <TextInput
                  style={styles.input}
                  value={quantidade}
                  onChangeText={setQuantidade}
                  keyboardType="numeric"
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>UNIDADE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="g, kg, un..."
                  placeholderTextColor="#A09386"
                  value={unidade}
                  onChangeText={setUnidade}
                />
              </View>
            </View>

            <Text style={styles.label}>CATEGORIA</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.scrollCategorias}
            >
              {CATEGORIAS.map((cat) => {
                const selecionada = categoria === cat.nome;

                return (
                  <TouchableOpacity
                    key={cat.nome}
                    onPress={() => setCategoria(cat.nome)}
                    style={[
                      styles.chipCategoria,
                      selecionada && styles.chipCategoriaSelecionada,
                    ]}
                  >
                    <Text
                      style={[
                        styles.textChip,
                        selecionada && styles.textChipSelecionado,
                      ]}
                    >
                      {cat.emoji} {cat.nome}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.label}>FOTO DO PRODUTO</Text>

            {imagemUri ? (
              <View style={styles.areaImagem}>
                <Image
                  source={{ uri: imagemUri }}
                  style={styles.previewImagem}
                />

                <View style={styles.acoesImagem}>
                  <TouchableOpacity
                    style={styles.botaoTrocarFoto}
                    onPress={selecionarFoto}
                  >
                    <Feather name="camera" size={15} color="#2E4A2E" />
                    <Text style={styles.textoTrocarFoto}>Trocar foto</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.botaoRemoverFoto}
                    onPress={() => setImagemUri(undefined)}
                  >
                    <Feather name="trash-2" size={15} color="#C04B4B" />
                    <Text style={styles.textoRemoverFoto}>Remover</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.botaoAdicionarFoto}
                onPress={selecionarFoto}
              >
                <Feather name="camera" size={21} color="#2E4A2E" />
                <Text style={styles.textoAdicionarFoto}>
                  Adicionar foto da galeria
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[
                styles.botaoSalvar,
                !nome.trim() && styles.botaoDesabilitado,
              ]}
              disabled={!nome.trim()}
              onPress={handleConfirmar}
            >
              <Text style={styles.textoBotaoSalvar}>
                {itemParaEditar ? 'Salvar alterações' : 'Adicionar à lista'}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: '#FAF8F5',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C2016',
  },
  botaoFechar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F0EAE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#8C7A6B',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#DDD4C8',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C2016',
  },
  linhaDupla: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  scrollCategorias: {
    marginVertical: 10,
  },
  chipCategoria: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#DDD4C8',
    marginRight: 8,
  },
  chipCategoriaSelecionada: {
    backgroundColor: '#2E4A2E',
    borderColor: '#2E4A2E',
  },
  textChip: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C2016',
  },
  textChipSelecionado: {
    color: '#FAF6F0',
  },
  areaImagem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#DDD4C8',
    gap: 14,
  },
  previewImagem: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: '#F0EAE0',
  },
  acoesImagem: {
    flex: 1,
    gap: 12,
  },
  botaoTrocarFoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  textoTrocarFoto: {
    color: '#2E4A2E',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoRemoverFoto: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  textoRemoverFoto: {
    color: '#C04B4B',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoAdicionarFoto: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: '#B9AA98',
    backgroundColor: '#FFFFFF',
  },
  textoAdicionarFoto: {
    color: '#2E4A2E',
    fontSize: 13,
    fontWeight: '600',
  },
  botaoSalvar: {
    backgroundColor: '#2E4A2E',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 8,
  },
  botaoDesabilitado: {
    backgroundColor: '#C4B4A4',
  },
  textoBotaoSalvar: {
    color: '#FAF6F0',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
