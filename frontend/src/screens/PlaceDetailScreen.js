import { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../AuthContext';
import { deletePlace } from '../placeService';
import { getPhotos, removePhotos } from '../photoStorage';
import { colors, fonts, STATUS } from '../theme';
import Button from '../components/Button';
import PhotoBox from '../components/PhotoBox';

export default function PlaceDetailScreen({ navigation, route }) {
  const { session } = useAuth();
  const { place } = route.params;
  const [photos, setPhotos] = useState({});

  useEffect(() => {
    getPhotos(place.id).then(setPhotos);
  }, []);

  function confirmDelete() {
    Alert.alert('Excluir lugar', `Deseja excluir "${place.placeName}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: handleDelete },
    ]);
  }

  async function handleDelete() {
    try {
      await deletePlace(session.token, place.id);
      await removePhotos(place.id);
      navigation.navigate('Places'); // volta para a lista
    } catch (e) {
      Alert.alert('Não foi possível excluir', e.message);
    }
  }

  const status = STATUS[place.status];
  const visited = place.status === 'VISITED';

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <Text style={styles.name}>{place.placeName}</Text>
      <Text style={styles.country}>{place.country}</Text>

      <View style={[styles.tag, { backgroundColor: status.color }]}>
        <Text style={styles.tagText}>{status.label}</Text>
      </View>

      <Text style={styles.section}>Me levou até lá</Text>
      <Text style={styles.text}>🎬 {place.movieTitle}</Text>

      {place.notes ? (
        <>
          <Text style={styles.section}>{visited ? 'Observação' : 'Motivo'}</Text>
          <Text style={styles.text}>{place.notes}</Text>
        </>
      ) : null}

      <View style={styles.photos}>
        {visited ? <PhotoBox label="Minha foto" uri={photos.me} /> : null}
        <PhotoBox label="Cena do filme" uri={photos.movie} />
      </View>

      <Button title="Editar" onPress={() => navigation.navigate('PlaceForm', { place })} />
      <Button title="Excluir" variant="danger" onPress={confirmDelete} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 8 },
  name: { fontFamily: fonts.titulo, fontSize: 34, color: colors.noite, lineHeight: 38 },
  country: { fontSize: 18, color: colors.areia },
  tag: { alignSelf: 'flex-start', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 999, marginTop: 8 },
  tagText: { color: colors.branco, fontWeight: '700', fontSize: 14 },
  section: { fontSize: 13, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: colors.areia, marginTop: 16 },
  text: { fontSize: 17, color: colors.noite, lineHeight: 24 },
  photos: { flexDirection: 'row', gap: 12, marginVertical: 20 },
});