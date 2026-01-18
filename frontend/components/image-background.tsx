import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native';
import { Image, ImageSource } from 'expo-image';

interface ImageBackgroundProps {
  source: ImageSource;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export function ImageBackground({ source, style, children, resizeMode = 'cover' }: ImageBackgroundProps) {
  return (
    <View style={[styles.container, style]}>
      <Image
        source={source}
        style={StyleSheet.absoluteFill}
        contentFit={resizeMode}
        cachePolicy="memory-disk"
        priority="high"
        transition={200}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
});
