import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../AuthContext';
import { createPlace, updatePlace } from '../placeService';
import { getPhotos, savePhotos } from '../photoStorage';
import { colors, STATUS } from '../theme';
import Button from '../components/Button';
import Field from '../components/Field';
import KeyboardScroll from '../components/KeyboardScroll';
import PhotoBox from '../components/PhotoBox';

// Serve para criar (sem "place") e para editar (com "place").
export default function PlaceFormScreen({ navigation, route }) {
  const { session } = useAuth();
  const place = route.params?.place;

  const [placeName, setPlaceName] = useState(place?.placeName ?? '');
  const [country, setCountry] = useState(place?.country ?? '');
  const [movieTitle, setMovieTitle] = useState(place?.movieTitle ?? '');
  const [status, setStatus] = useState(place?.status ?? route.params?.status ?? 'VISITED');
  const [notes, setNotes] = useState(place?.notes ?? '');
  const [photos, setPhotos] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Quem ainda não foi ao lugar não tem foto lá: só a cena do filme.
  const visited = status === 'VISITED';

  useEffect(() => {
    if (place) getPhotos(place.id).then(setPhotos);
  }, []);

  async function pickImage(kind) {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7 });
    if (!result.canceled) {
      setPhotos({ ...photos, [kind]: result.assets[0].uri });
    }
  }

  async function handleSave() {
    setError('');
    if (!placeName.trim() || !country.trim() || !movieTitle.trim()) {
      setError('Preencha o lugar, o país e o filme ou série.');
      return;
    }
    setSaving(true);
    try {
      const body = {
        placeName: placeName.trim(),
        country: country.trim(),
        movieTitle: movieTitle.trim(),
        status,
        notes: notes.trim(),
      };
      const saved = place
        ? await updatePlace(session.token, place.id, body)
        : await createPlace(session.token, body);
      await savePhotos(saved.id, visited ? photos : { movie: photos.movie });
      navigation.navigate('Places'); // volta para a lista
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  }

  return (
    <KeyboardScroll contentContainerStyle={styles.content}>
      <Field label="Lugar" value={placeName} onChangeText={setPlaceName} placeholder="Ex.: Cusco" />
      <Field label="País" value={country} onChangeText={setCountry} placeholder="Ex.: Peru" />
      <Field
        label="Filme ou série que me levou lá"
        value={movieTitle}
        onChangeText={setMovieTitle}
        placeholder="Ex.: A Nova Onda do Imperador"
      />

      <Text style={styles.label}>Situação</Text>
      <View style={styles.row}>
        {Object.keys(STATUS).map((key) => (
          <Pressable
            key={key}
            onPress={() => setStatus(key)}
            style={[styles.option, status === key && { backgroundColor: STATUS[key].color }]}
          >
            <Text style={[styles.optionText, status === key && { color: colors.branco }]}>{STATUS[key].label}</Text>
          </Pressable>
        ))}
      </View>

      <Field
        label={visited ? 'Observação (opcional)' : 'Motivo (opcional)'}
        value={notes}
        onChangeText={setNotes}
        multiline
        maxLength={500}
        style={{ minHeight: 90, textAlignVertical: 'top', paddingTop: 12 }}
        placeholder={visited ? 'O que você viu, sentiu ou fez lá' : 'Por que você quer ir para lá?'}
      />

      <View style={styles.row}>
        {visited ? <PhotoBox label="Minha foto" uri={photos.me} onPress={() => pickImage('me')} /> : null}
        <PhotoBox label="Cena do filme" uri={photos.movie} onPress={() => pickImage('movie')} />
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Salvar" onPress={handleSave} loading={saving} />
    </KeyboardScroll>
  );
}

const styles = StyleSheet.create({
  content: { padding: 20, gap: 14 },
  label: { fontSize: 15, fontWeight: '600', color: colors.noite, marginBottom: -6 },
  row: { flexDirection: 'row', gap: 12 },
  option: { flex: 1, minHeight: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.branco, borderWidth: 1, borderColor: colors.linha },
  optionText: { fontSize: 16, fontWeight: '700', color: colors.noite },
  error: { color: colors.erro, fontSize: 15, fontWeight: '600' },
});