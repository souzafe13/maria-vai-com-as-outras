import AsyncStorage from '@react-native-async-storage/async-storage';

// As fotos ficam só no celular: guardamos o endereço (uri) de cada imagem.
// Formato salvo: { me: 'uri da minha foto', movie: 'uri da cena do filme' }
const keyOf = (placeId) => `photos:${placeId}`;

export async function getPhotos(placeId) {
  try {
    const saved = await AsyncStorage.getItem(keyOf(placeId));
    return saved ? JSON.parse(saved) : {};
  } catch (e) {
    return {};
  }
}

export async function savePhotos(placeId, photos) {
  await AsyncStorage.setItem(keyOf(placeId), JSON.stringify(photos));
}

export async function removePhotos(placeId) {
  await AsyncStorage.removeItem(keyOf(placeId));
}
