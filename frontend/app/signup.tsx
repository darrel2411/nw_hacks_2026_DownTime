import { StyleSheet, View, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { Image } from 'expo-image';
import { ImageBackground } from '@/components/image-background';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useRouter } from 'expo-router';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useState } from 'react';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

  const saveToken = async (token: string) => {
    try {
      await SecureStore.setItemAsync('authToken', token);
    } catch (err) {
      try {
        localStorage.setItem('authToken', token);
      } catch {
        console.warn('Failed to store auth token', err);
      }
    }
  };

  const handleSignup = async () => {
    if (!email || !password || password !== retypePassword) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${apiUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const message = body?.error || 'Failed to sign up';
        setError(message);
        return;
      }

      const data = await res.json();
      if (data?.token) {
        await saveToken(data.token);
      }
      router.replace('/mood-checkin');
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/background.png')}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.gradient}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <IconSymbol name="chevron.left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <ThemedText style={styles.headerTitle}>DownTime</ThemedText>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <ThemedText style={styles.title}>Create an account</ThemedText>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Retype Password"
                placeholderTextColor="#999"
                value={retypePassword}
                onChangeText={setRetypePassword}
                secureTextEntry
              />
            </View>

            <TouchableOpacity
              style={[
                styles.signupButton,
                (!email || !password || password !== retypePassword || loading) && styles.signupButtonDisabled,
              ]}
              onPress={handleSignup}
              disabled={!email || !password || password !== retypePassword || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
              )}
            </TouchableOpacity>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <View style={styles.separator}>
              <View style={styles.separatorLine} />
              <ThemedText style={styles.separatorText}>or</ThemedText>
              <View style={styles.separatorLine} />
            </View>

            <TouchableOpacity style={[styles.socialButton, styles.googleButton]}>
              <Image 
                source={require('@/assets/images/google-logo.png')} 
                style={styles.googleLogo}
                contentFit="contain"
              />
              <ThemedText style={styles.googleButtonText}>Continue with Google</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.loginLink} onPress={() => router.push('/login')}>
              <ThemedText style={styles.loginText}>Already have an account? Log In</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6CFC0',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    backgroundColor: 'rgba(138, 43, 226, 0.15)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 10,
    marginBottom: 40,
    textAlign: 'center',
    paddingTop: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000',
  },
  signupButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  signupButtonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  separatorText: {
    marginHorizontal: 15,
    color: '#FFFFFF',
    fontSize: 14,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 0,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 10,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    color: '#ffefef',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '600',
  },
});
