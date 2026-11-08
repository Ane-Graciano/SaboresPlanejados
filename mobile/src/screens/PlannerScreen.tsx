
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { usePlanner } from '../context/PlannerContext';
import { SeletorDias } from '../components/SeletorDias';
import { CardSlotRefeicao } from '../components/CardSlotRefeicao';
import AllergyAlertBanner from '../components/AllergyAlertBanner';

import { TipoRefeicao } from '../types/planner';
import { useShoppingList } from '../context/ShoppingListContext';

import { buscarPreferenciasAlimentares } from '../services/preferenciasAlimentaresService';
import { buscarReceitaPorId } from '../services/receitaApiService';
import {
  checkRestrictions,
  IngredienteIncompativel,
} from '../utils/restrictionUtils';

const todosOsDiasCompletos = [
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
  "Domingo"
];

const rotulosRefeicoes: {
  key: TipoRefeicao;
  rotulo: string;
  emoji: string;
}[] = [
    { key: "cafeDaManha", rotulo: "Café da manhã", emoji: "☀️" },
    { key: "almoco", rotulo: "Almoço", emoji: "🌤️" },
    { key: "jantar", rotulo: "Jantar", emoji: "🌙" },
  ];

export default function PlannerScreen({ navigation }: any) {
  const [isDark, setIsDark] = useState(false);

  // Restrições alimentares cadastradas pelo usuário.
  const [restricoesUsuario, setRestricoesUsuario] = useState<string[]>([]);

  // Incompatibilidades identificadas, organizadas pelo ID da receita.
  const [alertasPorReceita, setAlertasPorReceita] = useState<
    Record<string, IngredienteIncompativel[]>
  >({});

  const {
    plano,
    diaSelecionado,
    totalDias,
    setDiaSelecionado,
    setTotalDias,
    removerRefeicao,
    atualizarPorcoes,
    iniciarAdicaoRefeicao,
    desfazer,
    refazer,
    podeDesfazer,
    podeRefazer,
    descricaoUltimaAcao
  } = usePlanner();

  const { gerarDoPlanejamentoSemanal } = useShoppingList();

  // Carrega as restrições alimentares do backend.
  useEffect(() => {
    let ativo = true;

    const carregarRestricoes = async () => {
      try {
        const preferencias = await buscarPreferenciasAlimentares();

        if (ativo) {
          setRestricoesUsuario(
            Array.isArray(preferencias.restricoes)
              ? preferencias.restricoes
              : []
          );
        }
      } catch (error) {
        console.error(
          'Não foi possível carregar as restrições alimentares:',
          error
        );
      }
    };

    carregarRestricoes();

    return () => {
      ativo = false;
    };
  }, []);

  // Consulta as receitas planejadas e verifica seus ingredientes.
  useEffect(() => {
    let ativo = true;

    const verificarReceitasPlanejadas = async () => {
      if (restricoesUsuario.length === 0) {
        setAlertasPorReceita({});
        return;
      }

      const idsReceitas = new Set<string>();

      Object.values(plano || {}).forEach((dia) => {
        if (!dia) return;

        const refeicoes = [
          dia.cafeDaManha,
          dia.almoco,
          dia.jantar,
          ...(dia.extras || []),
        ];

        refeicoes.forEach((refeicao) => {
          if (refeicao?.id) {
            idsReceitas.add(String(refeicao.id));
          }
        });
      });

      if (idsReceitas.size === 0) {
        setAlertasPorReceita({});
        return;
      }

      const resultados = await Promise.all(
        Array.from(idsReceitas).map(
          async (id): Promise<[string, IngredienteIncompativel[]]> => {
            try {
              const receita = await buscarReceitaPorId(id);

              if (!receita || !Array.isArray(receita.ingredientes)) {
                return [id, []];
              }

              const incompatibilidades = checkRestrictions(
                receita.ingredientes,
                restricoesUsuario
              );

              return [id, incompatibilidades];
            } catch (error) {
              console.error(
                `Não foi possível verificar a receita ${id}:`,
                error
              );

              // Uma falha individual não impede a verificação
              // das demais receitas planejadas.
              return [id, []];
            }
          }
        )
      );

      if (ativo) {
        setAlertasPorReceita(Object.fromEntries(resultados));
      }
    };

    verificarReceitasPlanejadas();

    return () => {
      ativo = false;
    };
  }, [plano, restricoesUsuario]);

  const hoje = new Date();
  const diaSemanaHoje = hoje.getDay();
  const hojeIndex = diaSemanaHoje === 0 ? 6 : diaSemanaHoje - 1;

  useEffect(() => {
    if (diaSelecionado === undefined || diaSelecionado === null) {
      setDiaSelecionado(hojeIndex >= 0 && hojeIndex < 7 ? hojeIndex : 0);
    }
  }, []);

  const distanciaAteSegunda = diaSemanaHoje === 0 ? -6 : 1 - diaSemanaHoje;
  const segundaFeiraDaSemana = new Date(hoje);
  segundaFeiraDaSemana.setDate(hoje.getDate() + distanciaAteSegunda);

  const indiceSeguro = (diaSelecionado >= 0 && diaSelecionado < todosOsDiasCompletos.length)
    ? diaSelecionado
    : 0;

  // TRAVA DE DIA PASSADO.
  const ehDiaPassado = indiceSeguro < hojeIndex;

  const dataSelecionada = new Date(segundaFeiraDaSemana);
  dataSelecionada.setDate(segundaFeiraDaSemana.getDate() + indiceSeguro);

  const nomeDiaFormatado = todosOsDiasCompletos[indiceSeguro] || "Segunda";
  const numeroDia = dataSelecionada.getDate();
  const nomeMesFormatado = dataSelecionada.toLocaleDateString('pt-BR', {
    month: 'long'
  });

  const themeBg = isDark ? '#15251C' : '#FFFFFF';
  const themeText = isDark ? '#FAF6F0' : '#2C2016';
  const themeMuted = isDark ? '#A09386' : '#8C7A6B';
  const themeBorder = isDark ? '#233A2C' : '#DDD4C8';
  const cardBg = isDark ? '#1F3326' : '#F7F3EE';

  const dadosDia = (plano && plano[indiceSeguro])
    ? plano[indiceSeguro]
    : {
      cafeDaManha: null,
      almoco: null,
      jantar: null,
      extras: []
    };

  const preenchidosFixos = [
    dadosDia.cafeDaManha,
    dadosDia.almoco,
    dadosDia.jantar
  ].filter(Boolean).length;

  const quantidadePreenchida =
    preenchidosFixos + (dadosDia.extras?.length || 0);

  // Reúne os alertas somente das refeições do dia selecionado.
  const ingredientesIncompativeisDia: IngredienteIncompativel[] = [
    ...(dadosDia.cafeDaManha?.id
      ? alertasPorReceita[String(dadosDia.cafeDaManha.id)] || []
      : []),

    ...(dadosDia.almoco?.id
      ? alertasPorReceita[String(dadosDia.almoco.id)] || []
      : []),

    ...(dadosDia.jantar?.id
      ? alertasPorReceita[String(dadosDia.jantar.id)] || []
      : []),

    ...(dadosDia.extras || []).flatMap((refeicao) =>
      alertasPorReceita[String(refeicao.id)] || []
    ),
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeBg }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.conteudoRolagem}
      >

        <View style={styles.linhaCabecalho}>
          <View>
            <Text style={[styles.subtituloData, { color: themeMuted }]}>
              Planejamento Familiar
            </Text>
            <Text style={[styles.titulo, { color: themeText }]}>
              Meu planejamento
            </Text>
          </View>

          <View style={styles.grupoHistorico}>
            <TouchableOpacity
              disabled={!podeDesfazer}
              onPress={desfazer}
              style={[
                styles.botaoHistorico,
                {
                  opacity: podeDesfazer ? 1 : 0.4,
                  borderColor: themeBorder,
                  backgroundColor: cardBg
                }
              ]}
            >
              <Feather name="rotate-ccw" size={16} color={themeText} />
            </TouchableOpacity>

            <TouchableOpacity
              disabled={!podeRefazer}
              onPress={refazer}
              style={[
                styles.botaoHistorico,
                {
                  opacity: podeRefazer ? 1 : 0.4,
                  borderColor: themeBorder,
                  backgroundColor: cardBg
                }
              ]}
            >
              <Feather name="rotate-cw" size={16} color={themeText} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.seletorIntervalo}>
          <Text style={[styles.rotuloIntervalo, { color: themeMuted }]}>
            Visualizar:
          </Text>

          {[3, 5, 7].map((num) => (
            <TouchableOpacity
              key={num}
              onPress={() => {
                setTotalDias(num);

                if (diaSelecionado >= num) {
                  setDiaSelecionado(0);
                }
              }}
              style={[
                styles.chipIntervalo,
                {
                  backgroundColor: totalDias === num ? '#2E4A2E' : cardBg,
                  borderColor: totalDias === num ? 'transparent' : themeBorder
                }
              ]}
            >
              <Text
                style={{
                  color: totalDias === num ? '#FAF6F0' : themeText,
                  fontSize: 11.5,
                  fontWeight: 'bold'
                }}
              >
                {num === 30 ? '30 dias' : `${num} dias`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.containerProgresso}>
          <View style={styles.rotulosProgresso}>
            <Text style={[styles.textoProgresso, { color: themeMuted }]}>
              {quantidadePreenchida} refeição(ões) planejada(s)
            </Text>
          </View>
        </View>

        <SeletorDias
          diaSelecionado={indiceSeguro}
          totalDias={totalDias}
          onSelecionarDia={setDiaSelecionado}
          isDark={isDark}
          textoMuted={themeMuted}
        />

        <Text style={[styles.tituloDiaSelecionado, { color: themeText }]}>
          {nomeDiaFormatado}, {numeroDia} de {nomeMesFormatado}
        </Text>

        <View style={styles.listaRefeicoes}>
          {rotulosRefeicoes.map(({ key, rotulo, emoji }) => {
            const chaveFixa = key as 'cafeDaManha' | 'almoco' | 'jantar';

            return (
              <CardSlotRefeicao
                key={key}
                tipoRefeicao={key}
                rotulo={rotulo}
                emoji={emoji}
                refeicao={dadosDia[chaveFixa]}
                onRemover={ehDiaPassado ? () => { } : () => removerRefeicao(indiceSeguro, key)}
                onAtualizarPorcoes={ehDiaPassado ? () => { } : (novasPorcoes) => atualizarPorcoes(indiceSeguro, key, novasPorcoes)}
                onAdicionarPressionado={ehDiaPassado ? () => { } : () => {
                  iniciarAdicaoRefeicao(indiceSeguro, key);
                  navigation.navigate('Buscar', { modoSelecao: true });
                }}
                onPressDetalhes={() => {
                  const refeicaoAtual = dadosDia[chaveFixa];

                  if (refeicaoAtual && refeicaoAtual.id) {
                    navigation.navigate('Detalhes', {
                      receitaId: String(refeicaoAtual.id),
                      porcoesInicial: refeicaoAtual.porcoes,
                      modoSelecao: true,
                    });
                  }
                }}
                isDark={isDark}
              />
            );
          })}

          {(dadosDia.extras || []).map((refeicaoExtra, index) => (
            <CardSlotRefeicao
              key={`extra-${refeicaoExtra.id}-${index}`}
              tipoRefeicao={'extra' as TipoRefeicao}
              rotulo={refeicaoExtra.categoria || `Extra ${index + 1}`}
              emoji="🍏"
              refeicao={refeicaoExtra}
              onRemover={ehDiaPassado ? () => { } : () => removerRefeicao(indiceSeguro, index)}
              onAtualizarPorcoes={ehDiaPassado ? () => { } : (novasPorcoes) => atualizarPorcoes(indiceSeguro, index, novasPorcoes)}
              onAdicionarPressionado={() => { }}
              onPressDetalhes={() => {
                navigation.navigate('Detalhes', {
                  receitaId: String(refeicaoExtra.id),
                  porcoesInicial: refeicaoExtra.porcoes,
                  modoSelecao: true,
                });
              }}
              isDark={isDark}
            />
          ))}

          {/* Alertas das receitas do dia selecionado. */}
          <AllergyAlertBanner
            ingredientesIncompativeis={ingredientesIncompativeisDia}
          />

          {!ehDiaPassado ? (
            <TouchableOpacity
              style={styles.botaoAdicionarGeral}
              activeOpacity={0.8}
              onPress={() => {
                iniciarAdicaoRefeicao(indiceSeguro, 'extra');
                navigation.navigate('Buscar', { modoSelecao: true });
              }}
            >
              <Feather name="plus" size={18} color="#FAF6F0" />
              <Text style={styles.textoBotaoAdicionar}>
                Adicionar receita
              </Text>
            </TouchableOpacity>
          ) : (
            <View
              style={[
                styles.avisoHistorico,
                { backgroundColor: cardBg, borderColor: themeBorder }
              ]}
            >
              <Feather name="clock" size={14} color={themeMuted} />
              <Text style={[styles.textoAvisoHistorico, { color: themeMuted }]}>
                Visualizando histórico. Alterações não são permitidas em dias passados.
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.botaoGerarCompras}
            activeOpacity={0.85}
            onPress={() => {
              gerarDoPlanejamentoSemanal(plano);
              navigation?.navigate('MainTabs', { screen: 'Shopping' });
            }}
          >
            <Feather name="zap" size={16} color="#FAF6F0" />
            <Text style={styles.textoBotaoGerarCompras}>
              Gerar compras da semana
            </Text>
          </TouchableOpacity>
        </View>

        {descricaoUltimaAcao && (
          <View style={styles.caixaAviso}>
            <Text style={styles.textoAviso}>{descricaoUltimaAcao}</Text>
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  conteudoRolagem: { paddingHorizontal: 20, paddingBottom: 40 },
  linhaCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12
  },
  subtituloData: { fontSize: 13, fontWeight: '500' },
  titulo: { fontSize: 24, fontWeight: 'bold' },
  grupoHistorico: { flexDirection: 'row', gap: 8 },
  botaoHistorico: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  seletorIntervalo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginVertical: 12
  },
  rotuloIntervalo: { fontSize: 12, fontWeight: '600' },
  chipIntervalo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1
  },
  containerProgresso: { marginVertical: 10 },
  rotulosProgresso: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6
  },
  textoProgresso: { fontSize: 12, fontWeight: '600' },
  tituloDiaSelecionado: { fontSize: 17, fontWeight: '600', marginBottom: 14 },
  listaRefeicoes: { gap: 4 },
  botaoAdicionarGeral: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2E4A2E',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  textoBotaoAdicionar: {
    color: '#FAF6F0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  avisoHistorico: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    marginTop: 12,
  },
  textoAvisoHistorico: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  botaoGerarCompras: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3E6A8A',
    borderRadius: 16,
    paddingVertical: 14,
    marginTop: 10,
  },
  textoBotaoGerarCompras: {
    color: '#FAF6F0',
    fontSize: 15,
    fontWeight: 'bold',
  },
  caixaAviso: {
    marginTop: 20,
    backgroundColor: '#2C2016',
    padding: 10,
    borderRadius: 10,
    alignSelf: 'center'
  },
  textoAviso: {
    color: '#FAF6F0',
    fontSize: 12,
    fontWeight: '600'
  },
});
