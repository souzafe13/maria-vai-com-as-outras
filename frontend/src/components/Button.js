import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

// variant: 'primary' (preenchido), 'outline' (contorno) ou 'danger' (contorno vermelho)
export default function Button({ title, onPress, loading, variant = 'primary' }) {
  const isPrimary = variant === 'primary';
  const color = variant === 'danger' ? colors.erro : colors.terracota;

  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => [
        styles.base,
        isPrimary ? { backgroundColor: colors.terracota } : { borderColor: color, borderWidth: 2 },
        pressed && { opacity: 0.8 },
      ]}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? colors.branco : color} />
      ) : (
        <Text style={[styles.text, { color: isPrimary ? colors.branco : color }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { minHeight: 50, borderRadius: 12, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  text: { fontSize: 17, fontWeight: '700' },
});
