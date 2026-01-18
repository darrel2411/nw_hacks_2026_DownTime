import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ImageBackground } from '@/components/image-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TodaysTipScreen() {
  const router = useRouter();
  const { tip } = useLocalSearchParams<{ tip?: string }>();
  const displayTip = tip || 'Be kind to yourself today.';

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
            <TouchableOpacity style={styles.menuButton}>
              <IconSymbol name="line.3.horizontal" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
            <ThemedText style={styles.title}>Today's Tip</ThemedText>
            <ThemedText style={styles.tipText}>Be kind to yourself today.</ThemedText>

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
});
