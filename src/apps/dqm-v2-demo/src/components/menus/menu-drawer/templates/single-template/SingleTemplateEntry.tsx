import type { FC } from "react";

import { PreCode } from "_views/pre-code/PreCode";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { Button, Typography } from "antd";

import type { WithIndexSingleTemplate } from "./SingleTemplate.types.mts";
import type { SingleTemplate } from "./SingleTemplate.types.mts";

import style from "./SingleTemplateEntry.module.css";

type SingleTemplateEntryProps = {
  entry: SingleTemplate;
} & WithIndexSingleTemplate;

export const SingleTemplateEntry: FC<SingleTemplateEntryProps> = ({
  active,
  entry,
  previewOnClick,
  useOnClick,
}) => {
  const isActive = entry.raw === active;
  return (
    <SkinnyCard active={isActive}>
      <Typography.Title className={style.title} level={5}>
        {entry.label}
      </Typography.Title>
      <Typography className={style.description}>{entry.description}</Typography>
      <PreCode className={style.sample}>{entry.raw}</PreCode>
      <div className={style.action}>
        <Button onClick={() => previewOnClick(entry.raw)}>Preview</Button>
        <Button onClick={() => useOnClick(entry.raw)}>Use</Button>
      </div>
    </SkinnyCard>
  );
};
