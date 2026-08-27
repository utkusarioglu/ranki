import {
  DATA_TYPE_CLASS_SELECTOR,
  INPUT_TYPE_CLASS_SELECTOR,
} from "_/selector.constants.mjs";

import type {
  AnkiTemplateFields,
  RankiFaces,
  RawFields,
} from "./collect.types.mjs";

import { ConfigFields } from "./config-fields.mjs";
import { hasher } from "./hasher.mjs";
import { TagAttributes } from "./tag-attributes.mjs";
import { getClassType } from "./utils.mjs";

export class CollectTemplate {
  /**
   * @dev
   * #1 Basically the theater needs to be the last class name
   * #2 This is very fragile
   */
  public static async all(): Promise<RawFields> {
    const htmlAttr = TagAttributes.collect();
    const fields = this.ankiFields();
    const config = await ConfigFields.collect();
    const faces = this.faces();
    const hash = hasher(htmlAttr, fields, config, faces);

    return {
      config,
      faces,
      fields,
      hash,
      htmlAttr,
    };
  }

  private static ankiFields(): AnkiTemplateFields {
    const dataElems = document.querySelectorAll(DATA_TYPE_CLASS_SELECTOR);
    return Object.fromEntries(
      Array.from(dataElems).map((data) => [getClassType(data), data.innerHTML]),
    ) as unknown as AnkiTemplateFields;
  }

  private static faces(): RankiFaces {
    const faces = Object.fromEntries(
      Array.from(document.querySelectorAll(INPUT_TYPE_CLASS_SELECTOR)).map(
        (e) => [getClassType(e), e],
      ),
    ) as RankiFaces;
    return faces;
  }
}
