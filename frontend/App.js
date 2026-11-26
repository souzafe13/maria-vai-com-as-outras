import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, AbrilFatface_400Regular } from '@expo-google-fonts/abril-fatface';

import { AuthProvider, useAuth } from './src/AuthContext';
import { colors } from './src/theme';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import PlacesScreen from './src/screens/PlacesScreen';
import PlaceFormScreen from './src/screens/PlaceFormScreen';
import PlaceDetailScreen from './src/screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator();

function Loading() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: colors.creme }}>
      <ActivityIndicator size="large" color={colors.terracota} />
    </View>
  );
}

// Se tem sessão (token), mostra as telas do app. Se não, mostra login e cadastro.
function Routes() {
  const { session, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.creme },
        headerTintColor: colors.noite,
        headerShadowVisible: false,
        headerBackTitle: '',
        contentStyle: { backgroundColor: colors.creme },
      }}
    >
      {session ? (
        <>
          <Stack.Screen name="Places" component={PlacesScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} options={{ title: 'Detalhes' }} />
          <Stack.Screen
            name="PlaceForm"
            component={PlaceFormScreen}
            options={({ route }) => ({ title: route.params?.place ? 'Editar lugar' : 'Novo lugar' })}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Criar conta' }} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({ AbrilFatface_400Regular });

  if (!fontsLoaded) return <Loading />;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
          <Routes />
        </NavigationContainer>
        <StatusBar style="dark" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
