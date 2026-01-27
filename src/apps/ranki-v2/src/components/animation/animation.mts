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
};

export class RankiAnimation {
  private static animate(self: RankiWc<{}>, pack: PropertiesPack) {
    return () =>
      new Promise<void>((resolve) => {
        if (pack.wait === undefined || pack.wait === true) {
          const cb = () => {
            self.setProperties({ ...pack.end });
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

  static expandXFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
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

  static fadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation.animate(self, {
      wait: additional?.wait,
      twoRafCb: additional?.twoRafCb,
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
