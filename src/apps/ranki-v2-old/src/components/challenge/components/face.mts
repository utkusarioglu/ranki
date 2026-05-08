import { Wc } from "_components/wc/wc.mjs";
import { assertNever } from "_error/assertions.mjs";
import { Timing } from "_utils/timing.mjs";

const DUR = 4e2;

interface RPairItemBasis {
  animation: { enabled: boolean };
}

export class RPairItem<T extends RPairItemBasis> extends Wc<T> {
  isActive(): boolean {
    return true;
  }

  getKey() {
    assertNever({ why: "This method needs to be overridden" });
  }

  setProps(s: T) {
    this.state.set(s);
  }

  private computeHeight() {
    const s = getComputedStyle(this);
    const tallerThanScreen = parseFloat(s.height) > window.innerHeight;
    const endHeight = tallerThanScreen ? window.innerHeight + "px" : s.height;
    return endHeight;
  }

  initialize(): void {
    this.animation
      .pushPreset("show", async () => {
        const curr = this.state.curr();
        await Timing.waitLayout();
        return {
          keyframes: [
            {
              opacity: 0,
              maxHeight: 0,
            },
            {
              opacity: 1,
              maxHeight: this.computeHeight(),
            },
          ],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "backwards",
          },
        };
      })
      .pushPreset("exit", () => {
        const curr = this.state.curr();
        return {
          keyframes: [
            {
              opacity: 1,
              maxHeight: this.computeHeight(),
            },
            {
              opacity: 0,
              maxHeight: 0,
            },
          ],
          options: {
            duration: curr.animation.enabled ? DUR : 0,
            fill: "backwards",
          },
        };
      });
  }
}
