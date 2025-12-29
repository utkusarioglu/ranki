import { type FC, type PropsWithChildren } from "react";
import { Typography } from "antd";
import style from "./SectionTitle.module.css";
import { assertNever } from "_assertions";

type Prefixes = "code:" | "";

type Part = `${Prefixes}${string}`;

interface SectionTitleProps {
  parts?: Part[];
}

export const SectionTitle: FC<PropsWithChildren<SectionTitleProps>> = ({
  parts,
  children,
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
            <Typography.Title level={4} code className={style.code}>
              {part.replace("code:", "")}
            </Typography.Title>
          ) : (
            <Typography.Title level={4} className={style.part}>
              {part}
            </Typography.Title>
          ),
        )
      )}
    </div>
  );
};
