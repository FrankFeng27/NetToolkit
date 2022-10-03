
const assert = require("assert");
import { splitTextToSentence } from "../public/src/Speech/SpeechUtils";

describe("SpeechUtils", () => {
  it ("should test splitTextToSentences", () => {
    const text1 = `CNN-News: 2022-9-22, Ukraine defeat Russian \r\n in Kyiv
    and other areas.`;
    const arr1 = splitTextToSentence(text1);
    assert.equal(arr1.length, 3);
  });
});
