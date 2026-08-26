import type { FC } from "react";

import { Button, Card, Typography } from "antd";

import type { SingleTemplateGroup } from "../single-template/SingleTemplate.types.mts";
import type {
  ArrangementTemplate,
  ArrangementTemplateSingleRef,
  WithIndexArrangementTemplates,
} from "./ArrangementTemplate.types.mts";

import style from "./ArrangementTemplateEntry.module.css";
import { ArrangementTemplateSinglePreview } from "./ArrangementTemplateSinglePreview";

type ArrangementTemplateEntryProps = {
  entry: ArrangementTemplate;
  singles: SingleTemplateGroup[];
} & WithIndexArrangementTemplates;

function retrieveSingle(
  singles: SingleTemplateGroup[],
  singleRef: ArrangementTemplateSingleRef,
) {
  const group = singles.find((s) => s.group === singleRef.group);
  if (!group) {
    throw new Error("NONEXISTENT_SINGLE_TEMPLATE_GROUP");
  }
  const entry = group.list.find((v) => v.id === singleRef.singleId);
  if (!entry) {
    throw new Error("NONEXISTENT_SINGLE_TEMPLATE");
  }
  return { entry, singleRef };
}

export const ArrangementTemplateEntry: FC<ArrangementTemplateEntryProps> = ({
  entry,
  previewOnClick,
  singles,
  useOnClick,
  // active,
}) => {
  const entries = entry.singles.map((s) => retrieveSingle(singles, s));
  const inputs = entries.map((e) => ({
    dqm: e.entry.raw,
    theater: e.singleRef.theater,
  }));

  // const isActive = entry.raw === active;
  const isActive = false;
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
      {entries.map(({ entry, singleRef }) => (
        <ArrangementTemplateSinglePreview
          entry={entry}
          key={singleRef.singleId}
          singleRef={singleRef}
        />
      ))}
      <div className={style.action}>
        <Button onClick={() => previewOnClick(inputs)}>Preview</Button>
        <Button onClick={() => useOnClick(inputs)}>Use</Button>
      </div>
    </Card>
  );
};
