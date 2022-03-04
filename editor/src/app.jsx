import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

function App() {
  const [code, setCode] = useState("");

  useEffect(() => {
    function openFileFn(e) {
      setCode(e.detail.data);
    }
    document.addEventListener("openfile", openFileFn);
    return () => document.removeEventListener("openfile", openFileFn);
  }, []);

  return (
    <CodeMirror
      value={code}
      extensions={[javascript({ jsx: true })]}
      height={"auto"}
      onChange={(value, viewUpdate) => {
        setCode(value);
      }}
    />
  );
}

export default App;
