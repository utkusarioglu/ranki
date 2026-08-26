import type { TryCatch } from "@dqm/package-dqm-v2-debug";

import { TryCatchView } from "_views/try-catch/try-catch";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import { type FC, type ReactNode } from "react";

import style from "./TryCatchSourceCard.module.css";

interface TryCatchSourceCardProps {
  item: TryCatch<any>;
  topDescription?: ReactNode;
}

export const TryCatchSourceCard: FC<TryCatchSourceCardProps> = ({
  item,
  topDescription,
}) => {
  return (
    <div className={style.channelCard}>
      {topDescription ? (
        <div className={style.title}>{topDescription}</div>
      ) : null}
      <TryCatchView
        item={item}
        Success={({ item }) => (
          <div className={style.code}>
            <YamlDisplay
              // @ts-expect-error
              obj={item.value}
            />
          </div>
        )}
      />
    </div>
  );
};
