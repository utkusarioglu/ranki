import { Button, Card, Typography } from "antd";
import type { FC } from "react";
import style from "./ArrangementTemplateEntry.module.css";
import type {
  ArrangementTemplate,
  ArrangementTemplateSingleRef,
  WithIndexArrangementTemplates,
} from "./ArrangementTemplate.types.mts";
import type { SingleTemplateGroup } from "../single-template/SingleTemplate.types.mts";
import { ArrangementTemplateSinglePreview } from "./ArrangementTemplateSinglePreview";

type ArrangementTemplateEntryProps = WithIndexArrangementTemplates & {
  entry: ArrangementTemplate;
  singles: SingleTemplateGroup[];
};

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
  singles,
  useOnClick,
  previewOnClick,
  // active,
}) => {
  const entries = entry.singles.map((s) => retrieveSingle(singles, s));
  const inputs = entries.map((e) => ({
    theater: e.singleRef.theater,
    dqm: e.entry.raw,
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
          key={singleRef.singleId}
          singleRef={singleRef}
          entry={entry}
        />
      ))}
      <div className={style.action}>
        <Button onClick={() => previewOnClick(inputs)}>Preview</Button>
        <Button onClick={() => useOnClick(inputs)}>Use</Button>
      </div>
    </Card>
  );
};
