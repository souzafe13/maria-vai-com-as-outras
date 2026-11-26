import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

// Mostra a foto, ou um ícone de câmera quando ainda não tem foto.
// Se receber onPress, dá para tocar e escolher uma imagem.
export default function PhotoBox({ label, uri, onPress }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <Pressable onPress={onPress} disabled={!onPress} style={styles.box}>
        {uri ? (
          <Image source={{ uri }} style={styles.image} />
        ) : (
          <View style={styles.empty}>
            <Ionicons name="camera-outline" size={34} color={colors.areia} />
            {onPress ? <Text style={styles.hint}>Toque para escolher</Text> : null}
          </View>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, gap: 6 },
  label: { fontSize: 15, fontWeight: '600', color: colors.noite },
  box: {
    aspectRatio: 3 / 4,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: colors.branco,
    borderWidth: 1,
    borderColor: colors.linha,
  },
  image: { width: '100%', height: '100%' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  hint: { fontSize: 13, color: colors.areia },
});
