import React, { useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { View, Alert, Button } from "react-native";
import { DownloadDirectoryPath, readFile } from "react-native-fs";
import { useTestFile } from "./gen-test";

import html from "../../../editor/dist/index.html";
const path = DownloadDirectoryPath + "/test.txt";

export const MonacoEditor = () => {
  const webviewRef = useRef<WebView<any>>(null);

  useTestFile(path);

  return (
    <View style={{ backgroundColor: "red", flex: 1 }}>
      <WebView
        setBuiltInZoomControls={false}
        setDisplayZoomControls={false}
        minimumFontSize={16}
        ref={webviewRef}
        source={{ html }}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        onMessage={(event: WebViewMessageEvent) => {
          Alert.alert(event.nativeEvent.data);
        }}
      />
      <Button
        title={"Read from file"}
        onPress={async () => {
          if (!webviewRef.current) return;
          console.log(path);
          const result = await readFile(path);
          const script = `
            (function() {
              const ev = new CustomEvent("openfile", {
                detail: {
                  data: ${JSON.stringify(result)},
                }
              });
              document.dispatchEvent(ev);
            })()
          `;
          console.log(script);
          webviewRef.current.injectJavaScript(script);
        }}
      />
    </View>
  );
};
