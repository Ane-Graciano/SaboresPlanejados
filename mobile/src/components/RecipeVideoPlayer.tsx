import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';

interface RecipeVideoPlayerProps {
  videoUrl?: string;
}

export function RecipeVideoPlayer({ videoUrl }: RecipeVideoPlayerProps) {
  const [hasError, setHasError] = useState(false);

  // LOG DE DEPURAÇÃO: Veja no terminal do Metro se a URL está chegando correta e com https
  console.log('URL do vídeo recebida no player:', videoUrl);

  const player = useVideoPlayer(videoUrl || '', (playerInstance) => {
    playerInstance.loop = true;
  });

  useEffect(() => {
    setHasError(false); // Reseta o erro ao trocar de receita
  }, [videoUrl]);

  useEffect(() => {
    if (!player) return;

    const subscription = player.addListener('statusChange', (event) => {
      if (event.status === 'error') {
        console.error('Erro detalhado do expo-video:', event);
        setHasError(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [player]);

  if (!videoUrl) {
    return (
      <View style={styles.fallbackContainer}>
        <Ionicons name="videocam-off-outline" size={32} color="#8A7560" />
        <Text style={styles.fallbackText}>
          Vídeo de preparo não disponível para esta receita.
        </Text>
      </View>
    );
  }

  if (hasError) {
    return (
      <View style={styles.fallbackContainer}>
        <Ionicons name="alert-circle-outline" size={32} color="#C46B3E" />
        <Text style={styles.fallbackText}>
          Não foi possível carregar o vídeo. Verifique se o link é um .mp4 válido.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <VideoView
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 240,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  fallbackContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#F5EDE2',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#E0D0BC',
  },
  fallbackText: {
    fontFamily: 'Nunito',
    fontSize: 13,
    color: '#8A7560',
    textAlign: 'center',
    marginTop: 8,
  },
});