import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../AuthContext';
import { colors } from '../theme';
import Button from '../components/Button';
import Field from '../components/Field';
import KeyboardScroll from '../components/KeyboardScroll';

const MIN_PASSWORD = 6; // mesma regra do back-end

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    setError('');
    if (!name.trim() || !email.trim() || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email.trim())) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (password.length < MIN_PASSWORD) {
      setError(`A senha precisa ter pelo menos ${MIN_PASSWORD} caracteres. A sua tem ${password.length}.`);
      return;
    }
    setLoading(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  const passwordOk = password.length >= MIN_PASSWORD;

  return (
    <KeyboardScroll contentContainerStyle={styles.content}>
      <View style={styles.form}>
        <Field label="Nome" value={name} onChangeText={setName} placeholder="Seu nome" />
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
          placeholder="Crie uma senha"
          hint={passwordOk ? '✓ Senha válida' : `Regra: pelo menos ${MIN_PASSWORD} caracteres.`}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Criar conta" onPress={handleRegister} loading={loading} />
      </View>
    </KeyboardScroll>
  );
}

const styles = StyleSheet.create({
  content: { padding: 24, alignItems: 'center' },
  form: { width: '100%', maxWidth: 420, gap: 14 },
  error: { color: colors.erro, fontSize: 15, fontWeight: '600' },
});