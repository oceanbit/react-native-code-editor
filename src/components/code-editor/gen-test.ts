import { useEffect } from "react";
import { stat, writeFile, unlink } from "react-native-fs";

const contents = `
const message = "Hello, world!"

function pigLatin(str) {
  let vowels = ['a', 'e', 'i', 'o', 'u'];
  let newStr = "";

  if (vowels.indexOf(str[0]) > -1) {
      newStr = str + "way";
      return newStr;
  } else {
      let firstMatch = str.match(/[aeiou]/g) || 0;
      let vowel = str.indexOf(firstMatch[0]);
      newStr = str.substring(vowel) + str.substring(0, vowel) + "ay";
      return newStr;
  }
}
  
console.log(pigLatin(message));
`.trim();

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
