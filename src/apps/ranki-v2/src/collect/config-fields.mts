import { ALL_CONFIG_TYPES_SELECTOR } from "_/selector.constants.mjs";
import { assertExists, assertNever } from "_error/assertions.mjs";
import { RankiAppError } from "_error/ranki-app-error.mjs";
import type {
  CollectedConfig,
  CollectedConfigEntry,
} from "./collect.types.mjs";
import { getResourceType, getClassType } from "./utils.mjs";

export class ConfigFields {
  public static async collect(): Promise<CollectedConfig> {
    const configPromises: Promise<CollectedConfigEntry>[] = [];
    try {
      const configElems = document.querySelectorAll(ALL_CONFIG_TYPES_SELECTOR);
      for (const e of configElems) {
        configPromises.push(this.configField(e));
      }
      const config: CollectedConfig = await Promise.all(configPromises);
      return config;
    } catch (e) {
      throw new RankiAppError({
        cause: e,
        code: "CONFIG_RETRIEVAL",
        why: "Fetch of the template config files have failed",
      });
    }
  }

  private static configField(e: Element) {
    const resourceType = getResourceType(e);
    switch (resourceType) {
      case "config":
        return Promise.resolve({
          config: e.innerHTML,
          name: getClassType(e),
        });
      case "config-file":
        return this.configFile(e);
      default:
        assertNever({
          details: { html: e.innerHTML, name: resourceType },
          why: "Unrecognized resource type",
        });
    }
  }

  private static async configFile(e: Element) {
    const src = e.getAttribute("href");
    try {
      assertExists(src, {
        why: "Src property is required for config file elements",
      });
      return (async () => ({
        config: await fetch(src).then((t) => t.text()),
        name: getClassType(e),
      }))();
    } catch (e) {
      throw new RankiAppError({
        cause: e,
        code: "CONFIG_FILE_RETRIEVAL",
        details: {
          src,
        },
        why: "Fetch of the template config files have failed",
      });
    }
  }
}
