import React, { useEffect, useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { View, Alert, Button } from "react-native";
import { DownloadDirectoryPath, readFile } from "react-native-fs";
import { useTestFile } from "./gen-test";

const path = DownloadDirectoryPath + "/test.txt";

export const MonacoEditor = () => {
  const webviewRef = useRef<WebView<any>>(null);

  const html = `
      <html>
      <head></head>
      <body>
        <button style="font-size: 1rem" id="clickme">Click Me</button>
        <p id="contents"></p>
        <script>
        const el = document.querySelector('#clickme');
        window.onerror = function(...props) {
          alert(props);
        }
        el.addEventListener('click', async function () {
          window.ReactNativeWebView.postMessage("Hello!")
        });
        document.addEventListener("openfile", (e) => {
          try {
            alert(e.detail.data);
            document.querySelector('#contents').innerHTML = e.detail.data;
          } catch(e) {
            alert(e)
          }
        })
        </script>
      </body>
      </html>
    `;

  useTestFile(path);

  return (
    <View style={{ backgroundColor: "red", flex: 1 }}>
      <WebView
        ref={webviewRef}
        textZoom={300}
        source={{ html }}
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        onMessage={(event: WebViewMessageEvent) => {
          Alert.alert(event.nativeEvent.data);
        }}
      />
      <Button
        title={"Click"}
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
