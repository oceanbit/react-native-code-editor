import { useEffect } from "react";
import { stat, writeFile, unlink } from "react-native-fs";

const contents = `
\`"'Testing'"\`
`
  .repeat(90);

export const useTestFile = (path: string) => {
  useEffect(() => {
    stat(path)
      .then((stat) => {
        if (stat.isFile()) {
          return unlink(path).then(() => path);
        }
        return Promise.resolve(path);
      })
      .then(() => {
        return writeFile(path, contents);
      })
      .catch((err) => {
        if (err.message.includes("File does not exist")) {
          return writeFile(path, contents);
        }
        console.error(err);
      });
  }, [path]);
};
