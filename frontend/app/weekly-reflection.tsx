import { StyleSheet, View, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

interface WeeklyData {
  breakdown: Record<string, number>;
  insight: string;
  tryThis: string;
  range: { start: string; end: string };
}

export default function WeeklyReflectionScreen() {
  const router = useRouter();
  const [weeklyData, setWeeklyData] = useState<WeeklyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

  // Mood color mapping
  const moodColors: Record<string, string> = {
    Great: '#FFD700',
    Happy: '#FFE5B4',
    Okay: '#87CEEB',
    Meh: '#D3D3D3',
    Sad: '#87CEFA',
    Stressed: '#FFB6C1',
    Tired: '#E6E6FA',
  };

  const getMoodColorStyle = (feeling: string) => {
    const color = moodColors[feeling] || '#E0E0E0';
    return { backgroundColor: color };
  };

  useEffect(() => {
    const fetchWeeklyInsight = async () => {
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
          setError('Please log in again.');
          setIsLoading(false);
          return;
        }

        const res = await fetch(`${apiUrl}/moods/weekly-insight`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setWeeklyData(data);
        } else {
          setError('Failed to fetch weekly insight');
        }
      } catch (err) {
        console.warn('Failed to fetch weekly insight', err);
        setError('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWeeklyInsight();
  }, []);

  const saveReflection = async () => {
    if (!weeklyData || isSaving) return;

    setIsSaving(true);
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
        setError('Please log in again.');
        return;
      }

      const res = await fetch(`${apiUrl}/reflections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          aiInsight: weeklyData.insight,
        }),
      });

      if (res.ok) {
        // Reflection saved successfully
        console.log('Reflection saved');
      } else {
        const errData = await res.json().catch(() => ({}));
        setError(errData?.error || 'Failed to save reflection');
      }
    } catch (err) {
      console.warn('Failed to save reflection', err);
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>DownTime</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4A90E2" />
        </View>
      </ThemedView>
    );
  }

  if (error || !weeklyData) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <IconSymbol name="chevron.left" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>DownTime</ThemedText>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error || 'No data available'}</ThemedText>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>DownTime</ThemedText>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.title}>Weekly Reflection</ThemedText>
        <ThemedText style={styles.subtitle}>Here's a look at your week</ThemedText>

        {weeklyData.breakdown && Object.keys(weeklyData.breakdown).length > 0 && (
          <View style={styles.section}>
            <ThemedText style={styles.sectionTitle}>Summary</ThemedText>
            <View style={styles.summaryBox}>
              {Object.entries(weeklyData.breakdown).map(([feeling, count], index) => (
                <View key={`${feeling}-${index}`} style={styles.summaryRow}>
                  <View style={[styles.pill, getMoodColorStyle(feeling)]}>
                    <ThemedText style={styles.pillText}>
                      {count}x {feeling} {count === 1 ? 'Day' : 'Days'}
                    </ThemedText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>AI Insight</ThemedText>
          <View style={styles.insightBox}>
            <ThemedText style={styles.insightText}>{weeklyData.insight}</ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Try This:</ThemedText>
          <View style={styles.tryThisBox}>
            <IconSymbol name="figure.mind.and.body" size={24} color="#4A90E2" />
            <ThemedText style={styles.tryThisText}>{weeklyData.tryThis}</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={saveReflection}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <ThemedText style={styles.saveButtonText}>Save This Reflection</ThemedText>
          )}
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0D8EA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 5,
    marginBottom: 8,
    paddingTop: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryRow: {
    marginBottom: 10,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  pillHappy: {
    backgroundColor: '#FFE5B4',
  },
  pillStressed: {
    backgroundColor: '#FFB6C1',
  },
  pillTired: {
    backgroundColor: '#E6E6FA',
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  insightBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 24,
  },
  tryThisBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tryThisText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  saveButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
