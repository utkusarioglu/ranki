import { type FC, type ReactNode } from "react";
import { TryCatchView } from "_views/try-catch/try-catch";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import style from "./TryCatchSourceCard.module.css";
import type { TryCatch } from "_utils/utils.mjs";

interface TryCatchSourceCardProps {
  topDescription?: ReactNode;
  item: TryCatch<any>;
}

export const TryCatchSourceCard: FC<TryCatchSourceCardProps> = ({
  topDescription,
  item,
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
