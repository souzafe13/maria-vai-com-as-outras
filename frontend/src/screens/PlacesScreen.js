import { useCallback, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../AuthContext';
import { listPlaces } from '../placeService';
import { colors, fonts, STATUS } from '../theme';
import Button from '../components/Button';

export default function PlacesScreen({ navigation }) {
  const { session, logout } = useAuth();
  const [tab, setTab] = useState('VISITED');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setError('');
    try {
      setPlaces(await listPlaces(session.token, tab));
    } catch (e) {
      if (e.status === 401) {
        logout(); // token expirado: volta para o login
        return;
      }
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [session.token, tab]);

  // Recarrega a lista sempre que a tela aparece (por exemplo, depois de salvar um lugar).
  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  function changeTab(newTab) {
    setLoading(true);
    setTab(newTab);
  }

  const emptyText =
    tab === 'VISITED'
      ? 'Você ainda não adicionou nenhum lugar que já visitou.'
      : 'Sua lista de desejos está vazia. Que filme vai te levar à próxima viagem?';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Maria vai</Text>
          <Text style={[styles.title, { color: colors.terracota }]}>com as outras</Text>
        </View>
        <Pressable onPress={logout} hitSlop={12}>
          <Text style={styles.logout}>Sair</Text>
        </Pressable>
      </View>
      <Text style={styles.hello}>Olá, {session.name}!</Text>

      <View style={styles.tabs}>
        {Object.keys(STATUS).map((key) => (
          <Pressable
            key={key}
            onPress={() => changeTab(key)}
            style={[styles.tab, tab === key && { backgroundColor: STATUS[key].color }]}
          >
            <Text style={[styles.tabText, tab === key && { color: colors.branco }]}>{STATUS[key].label}</Text>
          </Pressable>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} size="large" color={colors.terracota} />
      ) : (
        <FlatList
          data={places}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>{error || emptyText}</Text>}
          renderItem={({ item }) => (
            <Pressable
              style={styles.card}
              onPress={() => navigation.navigate('PlaceDetail', { place: item })}
            >
              <Text style={styles.cardTitle}>{item.placeName}</Text>
              <Text style={styles.cardText}>{item.country}</Text>
              <Text style={styles.cardMovie}>🎬 {item.movieTitle}</Text>
            </Pressable>
          )}
        />
      )}

      <View style={styles.footer}>
        <Button title="Novo lugar" onPress={() => navigation.navigate('PlaceForm', { status: tab })} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.creme },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 12 },
  title: { fontFamily: fonts.titulo, fontSize: 26, lineHeight: 30, color: colors.noite },
  logout: { fontSize: 16, fontWeight: '700', color: colors.terracota, paddingTop: 6 },
  hello: { paddingHorizontal: 20, marginTop: 8, fontSize: 15, color: colors.areia },
  tabs: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, marginTop: 16 },
  tab: { flex: 1, minHeight: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.branco, borderWidth: 1, borderColor: colors.linha },
  tabText: { fontSize: 16, fontWeight: '700', color: colors.noite },
  list: { padding: 20, gap: 12, flexGrow: 1 },
  empty: { textAlign: 'center', color: colors.areia, fontSize: 16, marginTop: 40, paddingHorizontal: 16 },
  card: { backgroundColor: colors.branco, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: colors.linha, gap: 4 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.noite },
  cardText: { fontSize: 15, color: colors.areia },
  cardMovie: { fontSize: 15, color: colors.noite, marginTop: 4 },
  footer: { padding: 20, paddingTop: 8 },
});