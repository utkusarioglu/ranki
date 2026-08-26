import { assertNever } from "_assertions";
import { Typography } from "antd";
import { type FC, type PropsWithChildren } from "react";

import style from "./SectionTitle.module.css";

type Part = `${Prefixes}${string}`;

type Prefixes = "" | "code:";

interface SectionTitleProps {
  parts?: Part[];
}

export const SectionTitle: FC<PropsWithChildren<SectionTitleProps>> = ({
  children,
  parts,
}) => {
  if (children && parts) {
    assertNever({ why: "You cannot both define `parts` and `children`" });
  }

  return (
    <div className={style.container}>
      {children ? (
        <Typography.Title level={4}>{children}</Typography.Title>
      ) : (
        parts &&
        parts.map((part) =>
          part.startsWith("code:") ? (
            <Typography.Title className={style.code} code key={part} level={4}>
              {part.replace("code:", "")}
            </Typography.Title>
          ) : (
            <Typography.Title className={style.part} key={part} level={4}>
              {part}
            </Typography.Title>
          ),
        )
      )}
    </div>
  );
};
