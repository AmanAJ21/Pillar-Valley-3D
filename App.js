
import { useCallback, useEffect, useState } from "react";
import { View, Platform } from "react-native";
import PillarJumpGame from "./src/components/PillarJumpGame";
import { loadVectorIconFonts } from "./src/config/fontLoader";



export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Load vector icon fonts for web platform
        if (Platform.OS === 'web') {
          await loadVectorIconFonts();
        }

        // Pre-load fonts, make any API calls you need to do here
        // Simulate loading time for demonstration
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);



  return (
    <View style={{ flex: 1 }}>
      <PillarJumpGame />
    </View>
  );
}
