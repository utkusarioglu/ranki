import { Card, Typography } from "antd";
import type { TemplateText } from "../../stores/code/types.mts";
import type { WithIndex } from "./TemplatesDrawer";
import type { FC } from "react";
import style from "./TemplateEntry.module.css";

type TemplateEntryProps = WithIndex & {
  entry: TemplateText;
};

export const TemplateEntry: FC<TemplateEntryProps> = ({
  entry,
  onClick,
  active,
}) => {
  const isActive = entry.raw === active;
  return (
    <Card
      className={[style.container, isActive && style.active]
        .filter((v) => v)
        .join(" ")}
      onClick={() => onClick(entry.raw)}
    >
      <Typography.Title className={style.title} level={4}>
        {entry.label}
      </Typography.Title>
      <Typography className={style.description}>{entry.description}</Typography>
      <pre className={style.pre}>
        <code>{entry.raw}</code>
      </pre>
    </Card>
  );
};
