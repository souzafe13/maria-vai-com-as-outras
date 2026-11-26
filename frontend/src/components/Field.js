import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// "hint" é um texto de ajuda opcional que aparece embaixo do campo.
// Se o campo for de senha (secureTextEntry), aparece o olhinho para mostrar ou ocultar.
export default function Field({ label, hint, style, secureTextEntry, ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = !!secureTextEntry;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View>
        <TextInput
          style={[styles.input, isPassword && styles.inputPassword, style]}
          placeholderTextColor={colors.areia}
          secureTextEntry={isPassword && !visible}
          {...props}
        />
        {isPassword ? (
          <Pressable
            style={styles.eye}
            onPress={() => setVisible(!visible)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel={visible ? 'Ocultar senha' : 'Mostrar senha'}
          >
            <Ionicons name={visible ? 'eye-off-outline' : 'eye-outline'} size={24} color={colors.areia} />
          </Pressable>
        ) : null}
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 6 },
  label: { fontSize: 15, fontWeight: '600', color: colors.noite },
  input: {
    minHeight: 50,
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.linha,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.noite,
  },
  inputPassword: { paddingRight: 52 },
  eye: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 50, alignItems: 'center', justifyContent: 'center' },
  hint: { fontSize: 14, color: colors.areia },
});