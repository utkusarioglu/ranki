import type {
  RankiWc,
  SetPropertiesArg,
} from "_components/ranki-wc/ranki-wc.mts";

export type AnimationTypes = Partial<
  Record<AnimationNames, () => Promise<Animation | void>>
>;

export type AnimationNames = "enter" | "exit" | "hide" | "show";

type PropertiesPack = {
  setup?: SetPropertiesArg;
  initial?: SetPropertiesArg;
  initialCb?: () => void;
  end?: SetPropertiesArg;
  endRemove?: string[];
};

export class RankiAnimation_OLD {
  private static animate(self: RankiWc<{}>, pack: PropertiesPack) {
    return () =>
      new Promise<void | Animation>((resolve) => {
        const cb = () => {
          self.setProperties({ ...pack.end });
          pack.endRemove && self.removeProperties(pack.endRemove);
          resolve();
        };
        self.addEventListener("transitionend", cb, { once: true });
        self.setProperties({ ...pack.setup });
        self.twoRaf(() => {
          self.setProperties({ ...pack.initial });
          pack.initialCb && pack.initialCb();
        });
      });
  }

  static expandYFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: [...(additional?.endRemove || []), "max-height"],
      setup: {
        opacity: 0,
        "max-height": 0,
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 1,
        "max-height": window.innerHeight + "px",
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static collapseYFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    const height = self.getHeight() || window.innerHeight;
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        "max-height": height + "px",
        opacity: 1,
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 0,
        "max-height": 0,
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static expandMarginRight(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        // opacity: 0,
        // width: 0,
        "margin-right": 0,
        ...(additional && additional.setup),
      },
      initial: {
        // opacity: 1,
        "margin-right": "1em",
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static collapseMarginRight(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        // width: width + "px",
        "margin-right": "1em",
        ...(additional && additional.setup),
      },
      initial: {
        // opacity: 0,
        // width: 0,
        "margin-right": 0,
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static expandXFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        opacity: 0,
        width: 0,
        // "margin-right": 0,
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 1,
        // "margin-right": "1em",
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static collapseXFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    const width = self.getWidth();
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        width: width + "px",
        // "margin-right": "1em",
        ...(additional && additional.setup),
      },
      initial: {
        // "margin-right": 0,
        opacity: 0,
        width: 0,
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  // static blurInFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
  //   return RankiAnimation.animate(self, {
  //     initialCb: additional?.initialCb,
  //     endRemove: [...(additional?.endRemove || []), "transform"],
  //     setup: {
  //       opacity: 0,
  //       transform: "blur(50px)",
  //       ...(additional && additional.setup),
  //     },
  //     initial: {
  //       opacity: 1,
  //       transform: "blur(0px)",
  //       ...(additional && additional.initial),
  //     },
  //     end: {
  //       ...(additional && additional.end),
  //     },
  //   });
  // }

  // static blurOutFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
  //   return RankiAnimation.animate(self, {
  //     initialCb: additional?.initialCb,
  //     endRemove: [...(additional?.endRemove || []), "transform"],
  //     setup: {
  //       opacity: 1,
  //       transform: "blur(0px)",
  //       ...(additional && additional.setup),
  //     },
  //     initial: {
  //       opacity: 0,
  //       transform: "blur(50px)",
  //       ...(additional && additional.initial),
  //     },
  //     end: {
  //       ...(additional && additional.end),
  //     },
  //   });
  // }

  static slideUpFadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        opacity: 0,
        transform: "translateY(50px)",
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 1,
        transform: "translateY(0)",
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static slideUpFadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        opacity: 1,
        // opacity: 0,
        transform: "translateY(0)",
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 0,
        transform: "translateY(-50px)",
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static fadeIn(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        opacity: 0,
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 1,
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }

  static fadeOut(self: RankiWc<{}>, additional?: PropertiesPack) {
    return RankiAnimation_OLD.animate(self, {
      initialCb: additional?.initialCb,
      endRemove: additional?.endRemove,
      setup: {
        opacity: 1,
        ...(additional && additional.setup),
      },
      initial: {
        opacity: 0,
        ...(additional && additional.initial),
      },
      end: {
        ...(additional && additional.end),
      },
    });
  }
}
