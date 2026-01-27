import type { RankiWc, SetPropertiesArg } from "../ranki-wc/ranki-wc.mts";

export type AnimationTypes = Partial<
  Record<AnimationNames, () => Promise<void>>
>;

export type AnimationNames = "enter" | "exit" | "hide" | "show";

type PropertiesPack = {
  wait?: boolean;
  pre?: SetPropertiesArg;
  twoRaf?: SetPropertiesArg;
  twoRafCb?: () => void;
  end?: SetPropertiesArg;
  endRemove?: string[];
};

export class RankiAnimation {
  private static animate(self: RankiWc<{}>, pack: PropertiesPack) {
    return () =>
      new Promise<void>((resolve) => {
        if (pack.wait === undefined || pack.wait === true) {
          const cb = () => {
            self.setProperties({ ...pack.end });
            pack.endRemove && self.removeProperties(pack.endRemove);
            resolve();
          };
          self.addEventListener("transitionend", cb, { once: true });
        }
        self.setProperties({ ...pack.pre });
        self.twoRaf(() => {
          self.setProperties({ ...pack.twoRaf });
          pack.twoRafCb && pack.twoRafCb();
        });
      });
  }

  static expandYFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: [...(additional?.endRemove || []), "max-height"],
      pre: {
        opacity: 0,
        "max-height": 0,
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 1,
        "max-height": window.innerHeight + "px",
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static collapseYFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    const height = self.getHeight() || window.innerHeight;
    console.log(height, self);
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        "max-height": height + "px",
        opacity: 1,
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 0,
        "max-height": 0,
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static expandXFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        opacity: 0,
        width: 0,
        "margin-right": 0,
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 1,
        "margin-right": "1em",
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static collapseXFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    const width = self.getWidth();
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        width: width + "px",
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 0,
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static slideUpFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        opacity: 0,
        transform: "translateY(50px)",
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 1,
        transform: "translateY(0)",
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }
  static slideUpFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        // opacity: 0,
        transform: "translateY(0)",
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 0,
        transform: "translateY(-50px)",
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static fadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        opacity: 0,
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 1,
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static fadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
      endRemove: additional?.endRemove,
      pre: {
        ...(additional && additional.pre),
      },
      twoRaf: {
        opacity: 0,
        ...(additional && additional.twoRaf),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }
}
