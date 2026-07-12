import { Link } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles}>
      <Text style={{ color: '#e8f0ea', fontSize: 20 }}>Page not found</Text>
      <Link href="/" style={{ color: '#8fd3b8', marginTop: 16 }}>
        Go to calculator
      </Link>
    </View>
  );
}

const styles = { flex: 1, alignItems: 'center', justifyContent: 'center' } as const;