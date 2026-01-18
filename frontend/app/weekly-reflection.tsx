import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function WeeklyReflectionScreen() {
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
        <ThemedText style={styles.title}>Weekly Reflection</ThemedText>
        <ThemedText style={styles.subtitle}>Here's a look at your week</ThemedText>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Summary</ThemedText>
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <View style={[styles.pill, styles.pillHappy]}>
                <ThemedText style={styles.pillText}>3x Happy Days</ThemedText>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={[styles.pill, styles.pillStressed]}>
                <ThemedText style={styles.pillText}>2x Stressed Days</ThemedText>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <View style={[styles.pill, styles.pillTired]}>
                <ThemedText style={styles.pillText}>2x Tired Days</ThemedText>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>AI Insight</ThemedText>
          <View style={styles.insightBox}>
            <ThemedText style={styles.insightText}>
              You've had a busy week. Remember to take a moment for yourself.
            </ThemedText>
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Try This:</ThemedText>
          <View style={styles.tryThisBox}>
            <IconSymbol name="figure.mind.and.body" size={24} color="#4A90E2" />
            <ThemedText style={styles.tryThisText}>Take a 5-minute breathing break</ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={styles.tipButton}
          onPress={() => router.push('/mood-checkin')}
        >
          <ThemedText style={styles.tipButtonText}>Check In Again</ThemedText>
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
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
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
  tipButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  tipButtonText: {
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
