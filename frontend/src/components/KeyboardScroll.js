import { useEffect, useState } from 'react';
import { Keyboard, Platform, ScrollView } from 'react-native';

// ScrollView que sai da frente do teclado.
// iOS: o próprio ScrollView ajusta. Android: adicionamos um espaço do tamanho do teclado.
export default function KeyboardScroll({ contentContainerStyle, children }) {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => setKeyboardHeight(e.endCoordinates.height));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboardHeight(0));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const extra = Platform.OS === 'android' ? keyboardHeight : 0;

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      automaticallyAdjustKeyboardInsets
      contentContainerStyle={[contentContainerStyle, { paddingBottom: 24 + extra }]}
    >
      {children}
    </ScrollView>
  );
}