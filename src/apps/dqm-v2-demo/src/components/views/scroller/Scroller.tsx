import type { FC, PropsWithChildren } from "react";

import horizontal from "./Scroller.horizontal.module.css";
import vertical from "./Scroller.vertical.module.css";

interface ScrollerProps {
  className?: string;
  direction: "horizontal" | "vertical";
}

// ANKI here the vertical scroller needs an intermediary called `viewport` to
// deal with `min-height` breaking the 100% height detection
export const Scroller: FC<PropsWithChildren<ScrollerProps>> = ({
  children,
  className,
  direction,
}) => {
  switch (direction) {
    case "horizontal":
      return (
        <div className={horizontal.container}>
          <div
            className={[horizontal.scroller, className]
              .filter((v) => v)
              .join(" ")}
          >
            {children}
          </div>
        </div>
      );
    case "vertical":
      return (
        <div className={vertical.container}>
          <div className={vertical.viewport}>
            <div
              className={[vertical.scroller, className]
                .filter((v) => v)
                .join(" ")}
            >
              {children}
            </div>
          </div>
        </div>
      );
  }
};
