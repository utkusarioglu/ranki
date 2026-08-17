import { assertFalse, assertTrue } from "_error/assertions.mjs";

import type { GeometryUpdateSession } from "./children.types.mjs";

export class UpdateSession {
  private static counter = 0;
  private active = false;
  private values: GeometryUpdateSession = {
    id: 0,
    index: -1,
    start: 0,
  };

  end() {
    this.active = false;
  }

  getValues() {
    return this.values;
  }

  isActive() {
    return this.active;
  }

  join() {
    assertTrue(this.active, {
      details: {
        active: this.active,
        values: this.getValues(),
      },
      why: "Cannot join if there is no active session",
    });
    ++this.values.index;
    return this.getValues();
  }

  start() {
    assertFalse(this.active, {
      details: {
        active: this.active,
        values: this.values,
      },
      why: "There is already an active session",
    });
    this.active = true;
    this.values = {
      id: UpdateSession.counter++,
      index: 0,
      start: Date.now(),
    };
    return this.getValues();
  }
}
