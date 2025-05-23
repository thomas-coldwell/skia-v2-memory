import {
  Canvas,
  Image,
  PaintStyle,
  Skia,
  SkImage,
} from "@shopify/react-native-skia";
import { Button, StyleSheet, Text, View } from "react-native";
import { runOnUI, useSharedValue } from "react-native-reanimated";

const SIZE = 300;

export default function App() {
  const texture = useSharedValue<SkImage | null>(null);
  const isRunning = useSharedValue(false);

  const runSkia = () => {
    runOnUI(() => {
      "worklet";
      const surface = Skia.Surface.MakeOffscreen(SIZE, SIZE);
      if (surface == null) {
        return;
      }
      const canvas = surface.getCanvas();
      const color = Skia.Color("white");
      const render = () => {
        if (!isRunning.value) {
          return;
        }
        canvas.clear(color);
        surface.flush();
        const snapshot = surface.makeImageSnapshot();
        const prevTexture = texture.value;
        texture.value = snapshot;
        prevTexture?.dispose();
        requestAnimationFrame(render);
      };
      isRunning.value = true;
      render();
    })();
  };

  return (
    <View style={styles.container}>
      <Button title="Run Skia" onPress={runSkia} />
      <Button title="Stop Skia" onPress={() => (isRunning.value = false)} />
      <Canvas style={styles.canvas}>
        <Image image={texture} x={0} y={0} width={SIZE} height={SIZE} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  canvas: {
    width: SIZE,
    height: SIZE,
    borderColor: "black",
    borderWidth: 1,
  },
});
