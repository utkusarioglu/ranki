import yaml from "yaml";
import { CONFIG_TYPE_CLASS_SELECTOR, DATA_TYPE_CLASS_SELECTOR, INPUT_TYPE_CLASS_SELECTOR, RANKI_TAG_INDICATOR, } from "../selector.constants..mts";
import { assertExists } from "@dqm/package-dqm-utils";
const FACE_ASSIGNMENTS = { A: ["A"], B: ["A", "B"] };
/**
 * @dev
 * #1 Basically the theater needs to be the last class name
 * #2 This is very fragile
 */
export function collectData() {
    const htmlElem = document.querySelector("html");
    assertExists(htmlElem, { why: "Cannot collect data without html element" });
    // #2
    const [mode, os, env] = htmlElem.className.split(" ");
    const dir = htmlElem.getAttribute("dir");
    const dataBsTheme = htmlElem.getAttribute("data-bs-theme");
    const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
    // @ts-expect-error
    const fields = Object.fromEntries(Array.from(dataElems).map((data) => [
        data.className.split(" ").at(-1).trim(), // #1
        data.innerHTML,
    ]));
    // @ts-expect-error
    let config = {};
    try {
        const configElems = document.querySelectorAll(CONFIG_TYPE_CLASS_SELECTOR);
        config = Object.fromEntries(Array.from(configElems).map((data) => [
            data.className.split(" ").at(-1).trim(), // #1
            yaml.parse(data.innerHTML),
        ]));
    }
    catch (e) {
        console.log(e);
    }
    // @ts-expect-error
    const theaterOrder = FACE_ASSIGNMENTS[fields.face];
    const inputs = theaterOrder.map((face) => {
        const selector = [INPUT_TYPE_CLASS_SELECTOR, face].join(".");
        const r = document.querySelector(selector);
        return { theater: face, dqm: r.innerHTML };
    });
    const address = fields.deck.split("::");
    const tagsArr = fields.tags
        .trim()
        .split(" ")
        .filter((v) => v.length);
    const rankiTags = [];
    const neutralTags = [];
    let marked = false;
    tagsArr.forEach((t) => {
        if (t.startsWith(RANKI_TAG_INDICATOR)) {
            rankiTags.push(t);
        }
        else if (t === "marked") {
            marked = true;
        }
        else {
            neutralTags.push(t);
        }
    });
    return {
        raw: {
            html: {
                os,
                env,
                mode,
                dir,
                dataBsTheme,
            },
            fields,
        },
        hud: {
            order: ["parser", "card", "address", "review", "tags"],
            parser: {
                hasReplacements: true,
                parseMode: "v2",
                errorLevel: "none",
            },
            address: {
                prefix: [],
                exposed: address,
                suffix: [],
            },
            tags: neutralTags,
            review: {
                marked,
                flag: {
                    type: fields.flag,
                    message: "Some message",
                },
            },
            card: {
                type: fields.type,
                face: fields.face,
            },
        },
        pref: { scheme: "dark" },
        inputs,
        theaterOrder,
        address,
        marked,
        neutralTags,
        rankiTags,
    };
}
