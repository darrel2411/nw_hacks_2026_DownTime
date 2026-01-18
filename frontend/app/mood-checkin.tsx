import { StyleSheet, View, TextInput, TouchableOpacity, ScrollView, Text, ImageBackground } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

const moods = [
  { emoji: '😊', label: 'Great', color: '#FFD700' },
  { emoji: '😐', label: 'Okay', color: '#87CEEB' },
  { emoji: '😑', label: 'Meh', color: '#D3D3D3' },
  { emoji: '😢', label: 'Sad', color: '#87CEFA' },
  { emoji: '😠', label: 'Stressed', color: '#FF6B6B' },
  { emoji: '😴', label: 'Tired', color: '#9370DB' },
];

export default function MoodCheckinScreen() {
  const router = useRouter();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [thoughts, setThoughts] = useState('');

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#000" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>DownTime</ThemedText>
            <TouchableOpacity style={styles.menuButton}>
              <IconSymbol name="line.3.horizontal" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <ThemedText style={styles.question}>How are you feeling today?</ThemedText>

        <View style={styles.moodContainer}>
          {moods.map((mood, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodButton,
                selectedMood === mood.label && styles.moodButtonSelected,
                { borderColor: mood.color },
              ]}
              onPress={() => setSelectedMood(mood.label)}
            >
              <Text style={styles.moodEmoji} allowFontScaling={false}>{mood.emoji}</Text>
              <ThemedText style={styles.moodLabel}>{mood.label}</ThemedText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.thoughtsContainer}>
          <ThemedText style={styles.thoughtsLabel}>What's on your mind?</ThemedText>
          <TextInput
            style={styles.thoughtsInput}
            placeholder="Feeling overwhelmed with work today."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            value={thoughts}
            onChangeText={setThoughts}
          />
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !selectedMood && styles.submitButtonDisabled]}
          onPress={() => router.push('/todays-tip')}
          disabled={!selectedMood}
        >
            <ThemedText style={styles.submitButtonText}>Submit</ThemedText>
          </TouchableOpacity>
        </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C2C2C',
    marginBottom: 30,
    textAlign: 'center',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  moodButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodButtonSelected: {
    borderWidth: 3,
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 40,
    marginBottom: 8,
    textAlign: 'center',
    includeFontPadding: false,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  thoughtsContainer: {
    marginBottom: 30,
  },
  thoughtsLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
  },
  thoughtsInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#000',
    minHeight: 120,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
