import { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../AuthContext';
import { colors, fonts } from '../theme';
import Button from '../components/Button';
import Field from '../components/Field';
import KeyboardScroll from '../components/KeyboardScroll';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) {
      setError('Informe o e-mail e a senha.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardScroll contentContainerStyle={styles.content}>
        <Image source={require('../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Maria vai</Text>
        <Text style={[styles.title, { color: colors.terracota }]}>com as outras</Text>
        <Text style={styles.subtitle}>Os lugares dos filmes que me levaram a viajar.</Text>

        <View style={styles.form}>
          <Field
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="voce@email.com"
          />
          <Field
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="Sua senha"
          />
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <Button title="Entrar" onPress={handleLogin} loading={loading} />
          <Button title="Criar conta" variant="outline" onPress={() => navigation.navigate('Register')} />
        </View>
      </KeyboardScroll>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.creme },
  content: { padding: 24, alignItems: 'center', justifyContent: 'center', flexGrow: 1 },
  logo: { width: 96, height: 96, marginBottom: 12 },
  title: { fontFamily: fonts.titulo, fontSize: 34, color: colors.noite, lineHeight: 38 },
  subtitle: { fontSize: 15, color: colors.areia, marginTop: 8, textAlign: 'center' },
  form: { width: '100%', maxWidth: 420, gap: 14, marginTop: 28 },
  error: { color: colors.erro, fontSize: 15, fontWeight: '600' },
});