import type { LocalAction } from "../events/types/geometry-events.types.mjs";
import type { GeometryInteractionEmit } from "../events/types/interaction.types.mjs";
import type {
  CurrentAppliedStyle,
  CurrentAppliedStyleWithoutActions,
} from "../types/geometry-controller.types.mjs";

import { INTERACTION_SEPARATOR } from "../sets/children/registry/children-registry.constants.mjs";

export class GeometryEval {
  public static evaluateActions(
    curr: CurrentAppliedStyleWithoutActions,
    prev: CurrentAppliedStyle | null,
  ): LocalAction[] {
    const actions = new Set<LocalAction>();

    let lifecycle = curr.self.lifecycle;
    if (lifecycle === "update" && prev === null) {
      lifecycle = "enter";
    }
    actions.add(`lifecycle${INTERACTION_SEPARATOR}${lifecycle}`);

    Object.entries(curr.self.interaction)
      .filter((v) => v[1] !== "none")
      .map((v) => v.join(INTERACTION_SEPARATOR) as GeometryInteractionEmit)
      .forEach((v) => actions.add(`interaction${INTERACTION_SEPARATOR}${v}`));

    return Array.from(actions);
  }
}
