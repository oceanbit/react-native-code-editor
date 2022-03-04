import React, { useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { View, Alert, Button } from "react-native";

export const MonacoEditor = () => {
  const webviewRef = useRef<WebView<any>>(null);

  const html = `
      <html>
      <head></head>
      <body>
        <button style="font-size: 1rem" id="clickme">Click Me</button>
        <script>
        const el = document.querySelector('#clickme');
        el.addEventListener('click', function () {
          window.ReactNativeWebView.postMessage("Hello!")
        });
        </script>
      </body>
      </html>
    `;

  return (
    <View style={{ backgroundColor: "red", flex: 1 }}>
      <WebView
        ref={webviewRef}
        textZoom={300}
        source={{ html }}
        onMessage={(event: WebViewMessageEvent) => {
          Alert.alert(event.nativeEvent.data);
        }}
      />
      <Button
        title={"Click"}
        onPress={() => {
          if (!webviewRef.current) return;
          webviewRef.current.injectJavaScript("alert('Hello!')");
        }}
      />
    </View>
  );
};
