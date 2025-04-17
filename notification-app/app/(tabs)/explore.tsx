import { View, Text } from 'react-native';

export default function ExploreScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Explorateur de données</Text>
      <Text style={{ marginTop: 10 }}>Visualisation des tendances</Text>
    </View>
  );
}