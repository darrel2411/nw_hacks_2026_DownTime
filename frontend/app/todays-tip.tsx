import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TodaysTipScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
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
            Write down one thing you're grateful for.
          </ThemedText>
        </View>

        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationGradient}>
            <View style={styles.illustration}>
              <View style={styles.book}>
                <View style={styles.bookPage} />
                <View style={styles.bookmark} />
              </View>
              <View style={styles.cup}>
                <View style={styles.cupTop} />
                <View style={styles.cupHandle} />
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.reflectButton}
          onPress={() => router.push('/weekly-reflection')}
        >
          <ThemedText style={styles.reflectButtonText}>View Weekly Reflection</ThemedText>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <ThemedText style={styles.footerText}>DownTime</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
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
    paddingBottom: 100,
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
    backgroundColor: '#FFE4E1',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  promptText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: '500',
  },
  illustrationContainer: {
    height: 300,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
  },
  illustrationGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFB6C1',
  },
  illustration: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  book: {
    width: 120,
    height: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginRight: 30,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  bookPage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
  },
  bookmark: {
    position: 'absolute',
    top: 20,
    right: -8,
    width: 16,
    height: 40,
    backgroundColor: '#90EE90',
    borderRadius: 4,
  },
  cup: {
    width: 80,
    height: 100,
    position: 'relative',
  },
  cupTop: {
    width: 80,
    height: 60,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 2,
    borderColor: '#D3D3D3',
  },
  cupHandle: {
    position: 'absolute',
    right: -20,
    top: 15,
    width: 30,
    height: 30,
    borderWidth: 2,
    borderColor: '#D3D3D3',
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  reflectButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  reflectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A90E2',
  },
});
