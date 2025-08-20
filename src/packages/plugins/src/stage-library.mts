import { PluginComponentStageSpec } from "@ranki/package-api";
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

  public insertStage(
    stage: undefined | PluginComponentStageSpec<TagType, ActionType>,
  ) {
    if (stage === undefined) {
      return;
    }
    const libraryIndex = this.library.push(stage) - 1;
    stage.types.forEach((type) => {
      if (this.types.has(type)) {
        throw new Error([ERRORS.typeExists, type].join(": "));
      }
      this.types.set(type, [libraryIndex, -1]);
    });
  }

  public async getAction(type: TagType): Promise<ActionType> {
    try {
      const [libraryIndex, actionIndex] = this.types.get(type);
      if (actionIndex !== -1) {
        return Promise.resolve(this.actions[actionIndex]);
      }
      const action = await this.library[libraryIndex].action();
      const newActionIndex = this.actions.push(action) - 1;
      this.types.set(type, [libraryIndex, newActionIndex]);
      return action;
    } catch (e) {
      console.log(type, e);
    }
  }
}
