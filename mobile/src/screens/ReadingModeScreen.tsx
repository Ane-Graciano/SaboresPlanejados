import React, { useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Receita } from '../model/receita';
import { useTimer } from '../context/TimerContext';

type ReadingModeRouteParams = {
  receita?: Receita;
};

type ReadingModeNavigation = {
  goBack?: () => void;
  navigate?: (screenName: string) => void;
};

type ReadingModeScreenProps = {
  navigation: ReadingModeNavigation;
  route: {
    params?: ReadingModeRouteParams;
  };
};

const FONT_SIZES = [
  { label: 'A', size: 15.5, lineHeight: 26 },
  { label: 'A', size: 18.5, lineHeight: 32 },
  { label: 'A', size: 22, lineHeight: 38 },
];

// Identifica durações escritas de diferentes maneiras.
function identificarTempo(texto: string): number | null {
  const textoNormalizado = texto.toLowerCase();

  // Exemplos: 1h30min, 1 hora e 30 minutos, 2h
  const horas = textoNormalizado.match(
    /(\d+)\s*(?:h|hora(?:s)?)(?:\s*(?:e)?\s*(\d+)\s*(?:m|min(?:s)?|minuto(?:s)?))?/
  );

  if (horas) {
    const quantidadeHoras = Number(horas[1]);
    const quantidadeMinutos = Number(horas[2] || 0);

    return quantidadeHoras * 3600 + quantidadeMinutos * 60;
  }

  // Exemplos: 5 min, 5min, 5 minutos
  const minutos = textoNormalizado.match(
    /(\d+)\s*(?:m|min(?:s)?|minuto(?:s)?)(?![a-z])/
  );

  if (minutos) {
    return Number(minutos[1]) * 60;
  }

  // Exemplos: 30 s, 30 seg, 30 segundos
  const segundos = textoNormalizado.match(
    /(\d+)\s*(?:s|seg(?:s)?|segundo(?:s)?)(?![a-z])/
  );

  if (segundos) {
    return Number(segundos[1]);
  }

  return null;
}

function formatarTempo(segundos: number) {
  const minutos = Math.floor(Math.max(0, segundos) / 60)
    .toString()
    .padStart(2, '0');

  const segundosRestantes = (Math.max(0, segundos) % 60)
    .toString()
    .padStart(2, '0');

  return `${minutos}:${segundosRestantes}`;
}

export default function ReadingModeScreen({
  navigation,
  route,
}: ReadingModeScreenProps) {
  const receita = route.params?.receita;

  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState<Set<number>>(new Set());
  const [fontIdx, setFontIdx] = useState(1);
  const [highContrast, setHighContrast] = useState(false);
  const [keepScreen, setKeepScreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timerFeedback, setTimerFeedback] = useState(false);

  const {
    timers,
    criarTimer,
    alternarPausa,
    cancelarTimer,
    dispensarTimer,
    reiniciarTimer,
  } = useTimer();

  const timersVisiveis = useMemo(
    () => timers.filter((timer) => !timer.dismissed),
    [timers]
  );

  const steps = useMemo(() => {
    return receita?.passos || [];
  }, [receita]);

  const total = steps.length;
  const step = steps[currentStep] || '';

  const isFirst = currentStep === 0;
  const isLast = total > 0 && currentStep === total - 1;
  const isDone = doneSteps.has(currentStep);

  // Detecta o tempo mencionado na etapa atual.
  const tempoDetectado = useMemo(
    () => identificarTempo(step),
    [step]
  );

  const markDone = () => {
    setDoneSteps((prev) => {
      const next = new Set(prev);

      if (next.has(currentStep)) {
        next.delete(currentStep);
      } else {
        next.add(currentStep);
      }

      return next;
    });
  };

  const iniciarTimerDaEtapa = () => {
    if (!tempoDetectado) return;

    criarTimer(
      `Etapa ${currentStep + 1}`,
      tempoDetectado
    );

    setTimerFeedback(true);
  };

  const goNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }

    setTimerFeedback(false);
    setCurrentStep((value) => value + 1);
  };

  const goPrev = () => {
    if (!isFirst) {
      setTimerFeedback(false);
      setCurrentStep((value) => value - 1);
    }
  };

  const restart = () => {
    setFinished(false);
    setCurrentStep(0);
    setDoneSteps(new Set());
    setTimerFeedback(false);
  };

  if (!receita || total === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="restaurant-outline"
              size={36}
              color="#6B8C6B"
            />
          </View>

          <Text style={styles.emptyTitle}>
            Modo de preparo indisponível
          </Text>

          <Text style={styles.emptyText}>
            Esta receita não possui etapas de preparo cadastradas.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack?.()}
          >
            <Text style={styles.backButtonText}>
              Voltar para receita
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (finished) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <View style={styles.finishedContainer}>
          <View style={styles.trophyContainer}>
            <Ionicons
              name="trophy-outline"
              size={48}
              color="#6B8C6B"
            />
          </View>

          <Text style={styles.finishedLabel}>
            Bom apetite!
          </Text>

          <Text style={styles.finishedTitle}>
            Receita concluída!
          </Text>

          <Text style={styles.finishedText}>
            Você concluiu todas as {total} etapas de {receita.titulo}.
          </Text>

          <View style={styles.finishedBadge}>
            <Text style={styles.finishedBadgeText}>
              {doneSteps.size} de {total} etapas marcadas
            </Text>
          </View>

          <TouchableOpacity
            style={styles.primaryFinishedButton}
            onPress={() => navigation.goBack?.()}
          >
            <Text style={styles.primaryFinishedButtonText}>
              Ver receita completa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryFinishedButton}
            onPress={restart}
          >
            <Text style={styles.secondaryFinishedButtonText}>
              Refazer do início
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const textColor = highContrast ? '#F0F5F0' : '#2C2016';
  const mutedColor = highContrast ? '#A8C8A8' : '#8A7B70';
  const cardColor = highContrast ? '#1E2E1E' : '#FFFFFF';
  const backgroundColor = highContrast ? '#141E14' : '#FAF8F5';
  const borderColor = highContrast ? '#3A5A3A' : '#E8E2D9';
  const accentColor = '#2E4A2E';

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor },
      ]}
    >
      <StatusBar
        barStyle={highContrast ? 'light-content' : 'dark-content'}
      />

      {/* Cabeçalho */}
      <View style={styles.topBar}>
        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: cardColor,
              borderColor,
            },
          ]}
          onPress={() => navigation.goBack?.()}
        >
          <Ionicons
            name="chevron-back"
            size={22}
            color={textColor}
          />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.modeLabel,
              { color: mutedColor },
            ]}
          >
            MODO DE PREPARO
          </Text>

          <Text
            numberOfLines={1}
            style={[
              styles.recipeTitle,
              { color: textColor },
            ]}
          >
            {receita.titulo}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.iconButton,
            {
              backgroundColor: cardColor,
              borderColor,
            },
          ]}
          onPress={() => setShowSettings(true)}
        >
          <Ionicons
            name="settings-outline"
            size={20}
            color={textColor}
          />
        </TouchableOpacity>
      </View>

      {/* Progresso das etapas */}
      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text
            style={[
              styles.progressText,
              { color: mutedColor },
            ]}
          >
            Etapa {currentStep + 1} de {total}
          </Text>

          <Text
            style={[
              styles.progressText,
              { color: mutedColor },
            ]}
          >
            {doneSteps.size} concluída
            {doneSteps.size !== 1 ? 's' : ''}
          </Text>
        </View>

        <View
          style={[
            styles.progressTrack,
            { backgroundColor: borderColor },
          ]}
        >
          <View
            style={[
              styles.progressFill,
              {
                width:
                  total > 1
                    ? `${(currentStep / (total - 1)) * 100}%`
                    : '100%',
              },
            ]}
          />
        </View>

        <View style={styles.dotsContainer}>
          {steps.map((_, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    index === currentStep
                      ? accentColor
                      : doneSteps.has(index)
                        ? '#6B8C6B'
                        : borderColor,
                },
              ]}
              onPress={() => {
                setTimerFeedback(false);
                setCurrentStep(index);
              }}
            >
              {doneSteps.has(index) &&
                index !== currentStep && (
                  <Ionicons
                    name="checkmark"
                    size={10}
                    color="#FFFFFF"
                  />
                )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Conteúdo da etapa */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.stepCard,
            {
              backgroundColor: cardColor,
              borderColor: isDone ? '#6B8C6B' : borderColor,
            },
          ]}
        >
          <View style={styles.stepHeader}>
            <View
              style={[
                styles.stepNumber,
                {
                  backgroundColor: isDone
                    ? '#6B8C6B'
                    : accentColor,
                },
              ]}
            >
              {isDone ? (
                <Ionicons
                  name="checkmark"
                  size={22}
                  color="#FAF6F0"
                />
              ) : (
                <Text style={styles.stepNumberText}>
                  {currentStep + 1}
                </Text>
              )}
            </View>

            <View style={styles.stepTitleContainer}>
              <Text
                style={[
                  styles.stepLabel,
                  {
                    color: isDone
                      ? '#6B8C6B'
                      : mutedColor,
                  },
                ]}
              >
                {isDone
                  ? 'CONCLUÍDA'
                  : isFirst
                    ? 'PRIMEIRA ETAPA'
                    : isLast
                      ? 'ÚLTIMA ETAPA'
                      : 'EM ANDAMENTO'}
              </Text>

              <Text
                style={[
                  styles.stepTitle,
                  { color: textColor },
                ]}
              >
                Etapa {currentStep + 1}
              </Text>
            </View>
          </View>

          <Text
            style={[
              styles.instructionText,
              {
                color: isDone ? mutedColor : textColor,
                fontSize: FONT_SIZES[fontIdx].size,
                lineHeight: FONT_SIZES[fontIdx].lineHeight,
              },
            ]}
          >
            {step}
          </Text>

          {/* Atalho para iniciar timer detectado */}
          {tempoDetectado !== null && (
            <View style={styles.detectedTimerContainer}>
              <View style={styles.detectedTimerInfo}>
                <View style={styles.detectedTimerIcon}>
                  <Ionicons
                    name="hourglass-outline"
                    size={20}
                    color="#64866A"
                  />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.detectedTimerTitle}>
                    Tempo identificado
                  </Text>

                  <Text style={styles.detectedTimerSubtitle}>
                    {formatarTempo(tempoDetectado)} de preparo
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.startTimerButton}
                onPress={iniciarTimerDaEtapa}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="play"
                  size={16}
                  color="#FFFFFF"
                />

                <Text style={styles.startTimerButtonText}>
                  Iniciar timer
                </Text>
              </TouchableOpacity>

              {timerFeedback && (
                <View style={styles.timerSuccessMessage}>
                  <Ionicons
                    name="checkmark-circle"
                    size={17}
                    color="#54815A"
                  />

                  <Text style={styles.timerSuccessText}>
                    Timer iniciado! Você pode continuar acompanhando a receita.
                  </Text>
                </View>
              )}
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.doneButton,
              {
                backgroundColor: isDone
                  ? highContrast
                    ? '#2A4A2A'
                    : '#EBF2EB'
                  : 'transparent',
                borderColor: isDone
                  ? '#6B8C6B'
                  : borderColor,
              },
            ]}
            onPress={markDone}
          >
            <View
              style={[
                styles.checkbox,
                {
                  backgroundColor: isDone
                    ? '#6B8C6B'
                    : 'transparent',
                  borderColor: isDone
                    ? '#6B8C6B'
                    : '#C4B4A4',
                },
              ]}
            >
              {isDone && (
                <Ionicons
                  name="checkmark"
                  size={13}
                  color="#FFFFFF"
                />
              )}
            </View>

            <Text
              style={[
                styles.doneButtonText,
                {
                  color: isDone
                    ? '#2E4A2E'
                    : mutedColor,
                },
              ]}
            >
              {isDone
                ? 'Etapa concluída'
                : 'Marcar como concluída'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Timers em andamento */}
        {timersVisiveis.length > 0 && (
          <View
            style={[
              styles.activeTimersContainer,
              {
                backgroundColor: cardColor,
                borderColor,
              },
            ]}
          >
            <View style={styles.activeTimersHeader}>
              <View style={styles.activeTimersHeading}>
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#64866A"
                />

                <Text
                  style={[
                    styles.activeTimersTitle,
                    { color: textColor },
                  ]}
                >
                  Seus timers
                </Text>
              </View>

              <View style={styles.timerCountBadge}>
                <Text style={styles.timerCountText}>
                  {timersVisiveis.length}
                </Text>
              </View>
            </View>

            {timersVisiveis.map((timer) => (
              <View
                key={timer.id}
                style={styles.timerItem}
              >
                <View style={styles.timerItemInfo}>
                  <Text
                    style={[
                      styles.timerItemName,
                      { color: textColor },
                    ]}
                    numberOfLines={1}
                  >
                    {timer.name}
                  </Text>

                  <Text
                    style={[
                      styles.timerItemStatus,
                      {
                        color:
                          timer.status === 'done'
                            ? '#C17A4D'
                            : mutedColor,
                      },
                    ]}
                  >
                    {timer.status === 'done'
                      ? 'Tempo concluído'
                      : timer.status === 'paused'
                        ? 'Pausado'
                        : 'Em andamento'}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.timerItemTime,
                    {
                      color:
                        timer.status === 'done'
                          ? '#C17A4D'
                          : '#64866A',
                    },
                  ]}
                >
                  {formatarTempo(timer.remaining)}
                </Text>

                <View style={styles.timerActions}>
                  {timer.status === 'done' ? (
                    <TouchableOpacity
                      style={styles.timerActionButton}
                      onPress={() => dispensarTimer(timer.id)}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={21}
                        color="#64866A"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.timerActionButton}
                      onPress={() => alternarPausa(timer.id)}
                    >
                      <Ionicons
                        name={
                          timer.status === 'running'
                            ? 'pause-circle-outline'
                            : 'play-circle-outline'
                        }
                        size={21}
                        color="#64866A"
                      />
                    </TouchableOpacity>
                  )}

                  <TouchableOpacity
                    style={styles.timerActionButton}
                    onPress={() => cancelarTimer(timer.id)}
                  >
                    <Ionicons
                      name="close-circle-outline"
                      size={21}
                      color="#A58F7D"
                    />
                  </TouchableOpacity>

                  {timer.status === 'done' && (
                    <TouchableOpacity
                      style={styles.timerActionButton}
                      onPress={() => reiniciarTimer(timer.id)}
                    >
                      <Ionicons
                        name="refresh-circle-outline"
                        size={21}
                        color="#64866A"
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            <TouchableOpacity
              style={styles.openAllTimersButton}
              onPress={() => navigation.navigate?.('TimerScreen')}
            >
              <Text style={styles.openAllTimersText}>
                Gerenciar todos os timers
              </Text>

              <Ionicons
                name="chevron-forward"
                size={16}
                color="#64866A"
              />
            </TouchableOpacity>
          </View>
        )}

        {/* Atalho para criar timer manualmente */}
        <TouchableOpacity
          style={[
            styles.timerShortcut,
            {
              backgroundColor: cardColor,
              borderColor,
            },
          ]}
          onPress={() => navigation.navigate?.('TimerScreen')}
          activeOpacity={0.8}
        >
          <View style={styles.timerShortcutIcon}>
            <Ionicons
              name="timer-outline"
              size={19}
              color="#64866A"
            />
          </View>

          <View style={styles.timerShortcutContent}>
            <Text
              style={[
                styles.timerShortcutTitle,
                { color: textColor },
              ]}
            >
              Criar timer personalizado
            </Text>

            <Text
              style={[
                styles.timerShortcutSubtitle,
                { color: mutedColor },
              ]}
            >
              Defina outro tempo de preparo
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={mutedColor}
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Navegação entre etapas */}
      <View
        style={[
          styles.navigationContainer,
          {
            backgroundColor,
            borderTopColor: borderColor,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.previousButton,
            {
              borderColor,
              opacity: isFirst ? 0.35 : 1,
            },
          ]}
          disabled={isFirst}
          onPress={goPrev}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={textColor}
          />

          <Text
            style={[
              styles.previousButtonText,
              { color: textColor },
            ]}
          >
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.nextButton,
            {
              backgroundColor: isLast
                ? '#C46B3E'
                : accentColor,
            },
          ]}
          onPress={goNext}
        >
          <Text style={styles.nextButtonText}>
            {isLast
              ? 'Finalizar receita'
              : 'Próxima etapa'}
          </Text>

          {!isLast && (
            <Ionicons
              name="chevron-forward"
              size={20}
              color="#FAF6F0"
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Configurações de leitura */}
      {showSettings && (
        <View style={styles.settingsOverlay}>
          <TouchableOpacity
            style={styles.settingsBackdrop}
            activeOpacity={1}
            onPress={() => setShowSettings(false)}
          />

          <View
            style={[
              styles.settingsSheet,
              {
                backgroundColor: highContrast
                  ? '#1C2C1C'
                  : '#FAF8F5',
              },
            ]}
          >
            <View style={styles.settingsHandle} />

            <View style={styles.settingsHeader}>
              <Text
                style={[
                  styles.settingsTitle,
                  { color: textColor },
                ]}
              >
                Configurações de leitura
              </Text>

              <TouchableOpacity
                onPress={() => setShowSettings(false)}
              >
                <Ionicons
                  name="close"
                  size={22}
                  color={mutedColor}
                />
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.settingsLabel,
                { color: mutedColor },
              ]}
            >
              TAMANHO DA FONTE
            </Text>

            <View style={styles.fontOptions}>
              {FONT_SIZES.map((font, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.fontOption,
                    {
                      backgroundColor:
                        fontIdx === index
                          ? '#2E4A2E'
                          : 'transparent',
                      borderColor:
                        fontIdx === index
                          ? '#2E4A2E'
                          : borderColor,
                    },
                  ]}
                  onPress={() => setFontIdx(index)}
                >
                  <Text
                    style={[
                      styles.fontOptionText,
                      {
                        color:
                          fontIdx === index
                            ? '#FAF6F0'
                            : textColor,
                        fontSize: font.size * 0.72 + 6,
                      },
                    ]}
                  >
                    {font.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text
              style={[
                styles.fontDescription,
                { color: mutedColor },
              ]}
            >
              {['Pequena', 'Média', 'Grande'][fontIdx]} —{' '}
              {FONT_SIZES[fontIdx].size}px
            </Text>

            {/* Alto contraste */}
            <View
              style={[
                styles.settingRow,
                { borderBottomColor: borderColor },
              ]}
            >
              <View style={styles.settingIcon}>
                <Ionicons
                  name="sunny-outline"
                  size={18}
                  color={textColor}
                />
              </View>

              <View style={styles.settingContent}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: textColor },
                  ]}
                >
                  Alto contraste
                </Text>

                <Text
                  style={[
                    styles.settingDescription,
                    { color: mutedColor },
                  ]}
                >
                  Fundo escuro para leitura confortável
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.toggle,
                  {
                    backgroundColor: highContrast
                      ? '#2E4A2E'
                      : '#D8CFBF',
                  },
                ]}
                onPress={() =>
                  setHighContrast((value) => !value)
                }
              >
                <View
                  style={[
                    styles.toggleCircle,
                    { left: highContrast ? 21 : 3 },
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* Manter tela ligada */}
            <View
              style={[
                styles.settingRow,
                { borderBottomColor: borderColor },
              ]}
            >
              <View style={styles.settingIcon}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={18}
                  color={textColor}
                />
              </View>

              <View style={styles.settingContent}>
                <Text
                  style={[
                    styles.settingTitle,
                    { color: textColor },
                  ]}
                >
                  Manter tela ligada
                </Text>

                <Text
                  style={[
                    styles.settingDescription,
                    { color: mutedColor },
                  ]}
                >
                  Evita bloqueio durante o preparo
                </Text>
              </View>

              <TouchableOpacity
                style={[
                  styles.toggle,
                  {
                    backgroundColor: keepScreen
                      ? '#2E4A2E'
                      : '#D8CFBF',
                  },
                ]}
                onPress={() =>
                  setKeepScreen((value) => !value)
                }
              >
                <View
                  style={[
                    styles.toggleCircle,
                    { left: keepScreen ? 21 : 3 },
                  ]}
                />
              </TouchableOpacity>
            </View>

            {/* Modo mãos livres */}
            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name="mic-outline"
                  size={18}
                  color={textColor}
                />
              </View>

              <View style={styles.settingContent}>
                <View style={styles.settingTitleRow}>
                  <Text
                    style={[
                      styles.settingTitle,
                      { color: textColor },
                    ]}
                  >
                    Modo mãos livres
                  </Text>

                  <View style={styles.comingSoonBadge}>
                    <Text style={styles.comingSoonText}>
                      Em breve
                    </Text>
                  </View>
                </View>

                <Text
                  style={[
                    styles.settingDescription,
                    { color: mutedColor },
                  ]}
                >
                  Controle por voz
                </Text>
              </View>

              <View
                style={[
                  styles.toggle,
                  { backgroundColor: '#D8CFBF' },
                ]}
              >
                <View
                  style={[
                    styles.toggleCircle,
                    { left: 3, opacity: 0.45 },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EBF2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2C2016',
    textAlign: 'center',
  },

  emptyText: {
    fontSize: 14,
    color: '#8A7B70',
    textAlign: 'center',
    lineHeight: 21,
    marginTop: 10,
  },

  backButton: {
    backgroundColor: '#2E4A2E',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 22,
  },

  backButtonText: {
    color: '#FAF6F0',
    fontSize: 15,
    fontWeight: '700',
  },

  finishedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 34,
  },

  trophyContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#EBF2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },

  finishedLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#6B8C6B',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },

  finishedTitle: {
    fontSize: 27,
    fontWeight: '700',
    color: '#2C2016',
    textAlign: 'center',
  },

  finishedText: {
    fontSize: 14.5,
    color: '#8A7B70',
    lineHeight: 23,
    textAlign: 'center',
    marginTop: 12,
  },

  finishedBadge: {
    backgroundColor: '#EBF2EB',
    borderWidth: 1.5,
    borderColor: '#D2E3D2',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginTop: 18,
  },

  finishedBadgeText: {
    color: '#2E4A2E',
    fontSize: 13,
    fontWeight: '700',
  },

  primaryFinishedButton: {
    width: '100%',
    backgroundColor: '#2E4A2E',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
  },

  primaryFinishedButtonText: {
    color: '#FAF6F0',
    fontSize: 16,
    fontWeight: '800',
  },

  secondaryFinishedButton: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#D2C8BD',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },

  secondaryFinishedButtonText: {
    color: '#5C4E43',
    fontSize: 15,
    fontWeight: '600',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },

  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },

  titleContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  modeLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
  },

  recipeTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 2,
  },

  progressSection: {
    paddingHorizontal: 22,
    paddingBottom: 14,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  progressText: {
    fontSize: 12.5,
    fontWeight: '700',
  },

  progressTrack: {
    height: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#2E4A2E',
    borderRadius: 5,
  },

  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },

  stepCard: {
    borderRadius: 24,
    borderWidth: 1.5,
    paddingHorizontal: 22,
    paddingVertical: 24,
    minHeight: 280,
  },

  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  stepNumber: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },

  stepNumberText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FAF6F0',
  },

  stepTitleContainer: {
    flex: 1,
  },

  stepLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 3,
  },

  stepTitle: {
    fontSize: 17,
    fontWeight: '700',
  },

  instructionText: {
    fontWeight: '400',
  },

  doneButton: {
    marginTop: 24,
    width: '100%',
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  doneButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Tempo identificado na etapa
  detectedTimerContainer: {
    backgroundColor: '#F3F7F0',
    borderRadius: 16,
    padding: 14,
    marginTop: 22,
    borderWidth: 1,
    borderColor: '#E0EBDD',
  },

  detectedTimerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },

  detectedTimerIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#E4EEE0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detectedTimerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#405C43',
  },

  detectedTimerSubtitle: {
    fontSize: 12,
    color: '#758875',
    marginTop: 3,
  },

  startTimerButton: {
    backgroundColor: '#64866A',
    borderRadius: 12,
    paddingVertical: 11,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  startTimerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },

  timerSuccessMessage: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 7,
    marginTop: 11,
  },

  timerSuccessText: {
    flex: 1,
    color: '#54815A',
    fontSize: 11.5,
    lineHeight: 17,
    fontWeight: '600',
  },

  // Timers ativos
  activeTimersContainer: {
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginTop: 14,
  },

  activeTimersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  activeTimersHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  activeTimersTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  timerCountBadge: {
    backgroundColor: '#E8F0E5',
    borderRadius: 12,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },

  timerCountText: {
    color: '#64866A',
    fontSize: 11,
    fontWeight: '700',
  },

  timerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#EEEAE3',
    gap: 8,
  },

  timerItemInfo: {
    flex: 1,
  },

  timerItemName: {
    fontSize: 13,
    fontWeight: '700',
  },

  timerItemStatus: {
    fontSize: 11,
    marginTop: 3,
  },

  timerItemTime: {
    fontSize: 16,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
  },

  timerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  timerActionButton: {
    padding: 3,
  },

  openAllTimersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEAE3',
    paddingTop: 12,
    marginTop: 4,
    gap: 5,
  },

  openAllTimersText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64866A',
  },

  // Atalho para criar timer manualmente
  timerShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    padding: 13,
    marginTop: 12,
    marginBottom: 12,
  },

  timerShortcutIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#EBF2EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  timerShortcutContent: {
    flex: 1,
  },

  timerShortcutTitle: {
    fontSize: 14,
    fontWeight: '700',
  },

  timerShortcutSubtitle: {
    fontSize: 11,
    marginTop: 3,
  },

  navigationContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderTopWidth: 1,
  },

  previousButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  previousButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },

  nextButton: {
    flex: 1.5,
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  nextButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FAF6F0',
  },

  settingsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },

  settingsBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(44,32,22,0.5)',
  },

  settingsSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 14,
    paddingBottom: 36,
  },

  settingsHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDD4C8',
    alignSelf: 'center',
    marginBottom: 22,
  },

  settingsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },

  settingsTitle: {
    fontSize: 19,
    fontWeight: '700',
  },

  settingsLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 12,
  },

  fontOptions: {
    flexDirection: 'row',
    gap: 10,
  },

  fontOption: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  fontOptionText: {
    fontWeight: '700',
  },

  fontDescription: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 20,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingBottom: 18,
    marginBottom: 18,
    borderBottomWidth: 1,
  },

  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: '#F5EDE2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  settingContent: {
    flex: 1,
  },

  settingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  settingTitle: {
    fontSize: 14.5,
    fontWeight: '600',
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 2,
  },

  comingSoonBadge: {
    backgroundColor: '#EBF2EB',
    borderWidth: 1,
    borderColor: '#D2E3D2',
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  comingSoonText: {
    color: '#6B8C6B',
    fontSize: 9.5,
    fontWeight: '700',
  },

  toggle: {
    width: 44,
    height: 26,
    borderRadius: 13,
    position: 'relative',
  },

  toggleCircle: {
    position: 'absolute',
    top: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});