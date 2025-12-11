import { Button, Card, Typography } from "antd";
import type { WithIndex } from "./TemplatesDrawer";
import type { FC } from "react";
import style from "./TemplateEntry.module.css";
import { PreCode } from "../pre-code/PreCode";
import type { TemplateTextProcessed } from "../../stores/dqm/dqm.store.types.mts";

type TemplateEntryProps = WithIndex & {
  entry: TemplateTextProcessed;
};

export const TemplateEntry: FC<TemplateEntryProps> = ({
  entry,
  useOnClick,
  previewOnClick,
  active,
}) => {
  const isActive = entry.raw === active;
  return (
    <Card
      className={[style.container, isActive && style.active]
        .filter((v) => v)
        .join(" ")}
    >
      <Typography.Title className={style.title} level={5}>
        {entry.label}
      </Typography.Title>
      <Typography className={style.description}>{entry.description}</Typography>
      <PreCode className={style.sample}>{entry.raw}</PreCode>
      <div className={style.action}>
        <Button onClick={() => previewOnClick(entry.raw)}>Preview</Button>
        <Button onClick={() => useOnClick(entry.raw)}>Use</Button>
      </div>
    </Card>
  );
};
