import yaml from "yaml";
import type {
  AnkiDeckParts,
  AnkiMarked,
  AnkiNeutralTags,
  AnkiRawTag,
  CardFaceArray,
  DataCollection,
  RankiTag,
  RankiTags,
} from "./collect.types.mts";
import {
  CONFIG_SELECTOR,
  DATA_SELECTOR,
  INPUT_SELECTOR,
  RANKI_TAG_INDICATOR,
} from "./collect.constants.mts";

const FACE_ASSIGNMENTS = { A: ["A"], B: ["A", "B"] };

/**
 * @dev
 * #1 Basically the theater needs to be the last class name
 */
export function collectData(): DataCollection {
  const dataElems = document.querySelectorAll(DATA_SELECTOR);
  // @ts-expect-error
  const data: DataCollection["data"] = Object.fromEntries(
    Array.from(dataElems).map((data) => [
      data.className.split(" ").at(-1)!.trim(), // #1
      data.innerHTML,
    ]),
  );

  // @ts-expect-error
  let config = {};
  try {
    const configElems = document.querySelectorAll(CONFIG_SELECTOR);
    config = Object.fromEntries(
      Array.from(configElems).map((data) => [
        data.className.split(" ").at(-1)!.trim(), // #1
        yaml.parse(data.innerHTML),
      ]),
    );
  } catch (e) {
    console.log(e);
  }
  // console.log("data", data);
  // console.log("config", config);

  // @ts-expect-error
  const selectedFaces: CardFaceArray = FACE_ASSIGNMENTS[data.face];

  const inputs = selectedFaces.map((face) => {
    const selector = [INPUT_SELECTOR, face].join(".");
    const r = document.querySelector(selector)!;
    return { theater: face, dqm: r.innerHTML };
  });
  const address = data.deck.split("::") as AnkiDeckParts;

  const tagsArr = data.tags
    .trim()
    .split(" ")
    .filter((v) => v.length);
  const rankiTags = [] as RankiTags;
  const neutralTags = [] as AnkiNeutralTags;
  let marked = false as AnkiMarked;
  tagsArr.forEach((t) => {
    if (t.startsWith(RANKI_TAG_INDICATOR)) {
      rankiTags.push(t as RankiTag);
    } else if (t === "marked") {
      marked = true as AnkiMarked;
    } else {
      neutralTags.push(t as AnkiRawTag);
    }
  });

  return {
    pref: { scheme: "dark" },
    data,
    inputs,
    selectedFaces,
    address,
    marked,
    neutralTags,
    rankiTags,
  };
}
