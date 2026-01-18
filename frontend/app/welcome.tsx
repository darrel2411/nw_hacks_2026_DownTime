import { StyleSheet, View, TouchableOpacity, ImageBackground, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/welcome-background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.gradient} edges={['top', 'bottom']}>
          <View style={styles.content}>
            <ThemedText style={styles.welcomeText}>Welcome to</ThemedText>
            <ThemedText
              style={styles.title}
              numberOfLines={1}
              adjustsFontSizeToFit={Platform.OS !== 'web'}
              minimumFontScale={0.7}
            >
              DownTime
            </ThemedText>
            <ThemedText style={styles.subtitle}>Your Daily Mood Check-In Companion</ThemedText>
            <ThemedText style={styles.tagline}>Reflect, Understand, Breathe.</ThemedText>

            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/login')}
            >
              <ThemedText style={styles.buttonText}>Get Started</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </ThemedView>
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
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 20,
    minHeight: 0,
  },
  welcomeText: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
    opacity: 0.9,
  },
  title: {
    fontSize: Platform.OS === 'ios' ? 48 : 42,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 10,
    lineHeight: Platform.OS === 'ios' ? 56 : 50,
  },
  subtitle: {
    fontSize: 20,
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
    opacity: 0.95,
  },
  tagline: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 60,
    textAlign: 'center',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginTop: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
