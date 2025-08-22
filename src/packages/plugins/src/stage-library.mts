import type { PluginComponentStageSpec, Plugin } from "@ranki/package-api";
import { ERRORS } from "./constants.mjs";

type LibraryIndex = number & {
  flavor?: "libraryIndex";
};

type ActionIndex = number & {
  flavor?: "actionIndex";
};

export class StageLibrary<TagType, ActionType> {
  private library: PluginComponentStageSpec<TagType, ActionType>[] = [];
  private actions: ActionType[] = [];
  private types = new Map<TagType, [LibraryIndex, ActionIndex]>();
  public role: string;

  constructor(role: string) {
    this.role = role;
  }

  public insertStage(
    stage: undefined | PluginComponentStageSpec<TagType, ActionType>,
    metadata: Plugin["metadata"],
  ) {
    if (stage === undefined) {
      return;
    }
    const libraryIndex = this.library.push(stage) - 1;
    stage.types.forEach((type) => {
      if (this.types.has(type)) {
        throw new Error([ERRORS.typeExists, type].join(": "));
      }
      // TODO this needs to move to the else block of if but that
      // triggers a race condition because plugin registration and load
      // needs to be async and filled with promise.all here and in plugin.mts
      this.types.set(type, [libraryIndex, -1]);
      if (metadata.loadMethod === "preload") {
        this.loadAction(type, libraryIndex);
      }
    });
  }

  private async loadAction(
    tagType: TagType,
    libraryIndex: LibraryIndex,
  ): Promise<ActionType> {
    const action = await this.library[libraryIndex].action();
    const newActionIndex = this.actions.push(action) - 1;
    this.types.set(tagType, [libraryIndex, newActionIndex]);
    return action;
  }

  public async getAction(tagType: TagType): Promise<ActionType> {
    try {
      const [libraryIndex, actionIndex] = this.types.get(tagType);
      if (actionIndex !== -1) {
        return Promise.resolve(this.actions[actionIndex]);
      }
      return this.loadAction(tagType, libraryIndex);
    } catch (e) {
      console.log(tagType, e);
    }
  }
}
