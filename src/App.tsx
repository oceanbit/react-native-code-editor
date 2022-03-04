import React from "react";
import {
  SafeAreaView,
  StatusBar,
  useColorScheme,
} from "react-native";
import { MonacoEditor } from "./components/monaco";

const App = () => {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={isDarkMode ? "light-content" : "dark-content"} />
      <MonacoEditor />
    </SafeAreaView>
  );
};

export default App;
