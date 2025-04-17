import { View, Text, Button } from 'react-native';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Tableau de bord principal</Text>
      <Link href="/(tabs)/explore" asChild>
        <Button title="Voir l'historique des alertes" />
      </Link>
    </View>
  );
}