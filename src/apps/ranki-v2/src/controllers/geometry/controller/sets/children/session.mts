import { assertFalse, assertTrue } from "_error/assertions.mjs";
import type { GeometryUpdateSession } from "./children.types.mjs";

export class UpdateSession {
  public values: GeometryUpdateSession = {
    id: 0,
    start: 0,
    index: -1,
  };
  private active = false;
  private static counter = 0;

  end() {
    this.active = false;
  }

  start() {
    assertFalse(this.active, {
      why: "There is already an active session",
      details: {
        active: this.active,
        values: this.values,
      },
    });
    this.active = true;
    this.values = {
      id: UpdateSession.counter++,
      start: Date.now(),
      index: 0,
    };
    return this.values;
  }

  join() {
    assertTrue(this.active, {
      why: "Cannot join if there is no active session",
      details: {
        active: this.active,
        values: this.values,
      },
    });
    ++this.values.index;
    return this.values;
  }

  isActive() {
    return this.active;
  }
}
