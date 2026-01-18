import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ImageBackground } from '@/components/image-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function TodaysTipScreen() {
  const router = useRouter();
  const { tip } = useLocalSearchParams<{ tip?: string }>();
  const [displayTip, setDisplayTip] = useState(tip || 'Be kind to yourself today.');
  const [todaysMood, setTodaysMood] = useState<{ feeling: string; description?: string; tip?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

  useEffect(() => {
    const fetchTodaysMood = async () => {
      try {
        let token: string | null = null;
        try {
          token = await SecureStore.getItemAsync('authToken');
        } catch (err) {
          try {
            token = typeof localStorage !== 'undefined' ? localStorage.getItem('authToken') : null;
          } catch {
            console.warn('Failed to read auth token', err);
          }
        }

        if (!token) {
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${apiUrl}/moods/today`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setTodaysMood(data);
          // Use the tip from today's mood if available, otherwise use the passed tip or default
          if (data.tip) {
            setDisplayTip(data.tip);
          }
        }
      } catch (err) {
        console.warn('Failed to fetch today\'s mood', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodaysMood();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('@/assets/images/tip-background.png')}
          style={styles.backgroundImage}
          resizeMode="cover"
        >
          <View style={styles.overlay}>
            <View style={[styles.content, styles.loadingContainer]}>
              <ActivityIndicator size="large" color="#4A90E2" />
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/tip-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>DownTime</ThemedText>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <ThemedText style={styles.title}>Today's Tip</ThemedText>
            {todaysMood && (
              <ThemedText style={styles.moodLabel}>
                Based on your {todaysMood.feeling} mood
              </ThemedText>
            )}

            <View style={styles.promptBox}>
              <ThemedText style={styles.promptText}>
                {displayTip}
              </ThemedText>
            </View>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.reflectButton}
              onPress={() => router.push('/weekly-reflection')}
            >
              <ThemedText style={styles.reflectButtonText}>View Weekly Reflection</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 25,
    paddingBottom: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 40,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
    marginBottom: 16,
    paddingTop: 5,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 28,
  },
  promptBox: {
    backgroundColor: 'rgba(255, 228, 225, 0.3)',
    borderRadius: 16,
    padding: 30,
    marginBottom: 30,
    minHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 228, 225, 0.5)',
  },
  promptText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  reflectButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  reflectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  moodLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
