import React, { useEffect, useRef } from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import { View, Alert, Button } from "react-native";
import { DownloadDirectoryPath, stat, writeFile } from "react-native-fs";
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
        el.addEventListener('click', function () {
          window.ReactNativeWebView.postMessage("Hello!")
        });
        document.addEventListener("openfile", (e) => {
          document.querySelector('#contents').innerHTML = JSON.stringify(e.detail);
        })
        </script>
      </body>
      </html>
    `;

  useEffect(() => {
    stat(path)
      .then((stat) => {
        if (!stat.isFile()) {
          return writeFile(path, "Testing hello 123");
        }
      })
      .catch((err) => {
        if (err.message.includes("File does not exist")) {
          return writeFile(path, "Testing hello 123");
        }
        console.error(err);
      });
  }, []);

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
        onPress={() => {
          if (!webviewRef.current) return;
          console.log(path);
          const script = `
            (function() {
              const ev = new CustomEvent("openfile", {
                detail: {
                  path: "${path}",
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
