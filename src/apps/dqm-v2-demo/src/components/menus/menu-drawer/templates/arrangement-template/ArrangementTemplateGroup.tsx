import type { FC } from "react";
import { Typography } from "antd";
import style from "./ArrangementTemplateGroup.module.css";
import { ArrangementTemplateEntry } from "./ArrangementTemplateEntry";
import type {
  ArrangementTemplateGroup as ArrangementTemplateGroupType,
  WithIndexArrangementTemplates,
} from "./ArrangementTemplate.types.mts";
import type { SingleTemplateGroup } from "../single-template/SingleTemplate.types.mts";

type TemplateGroupProps = WithIndexArrangementTemplates & {
  group: ArrangementTemplateGroupType;
  singles: SingleTemplateGroup[];
};

export const ArrangementTemplateGroup: FC<TemplateGroupProps> = ({
  group,
  index,
  useOnClick,
  previewOnClick,
  active,
  singles,
}) => {
  return (
    <div className={style.container}>
      <hgroup className={style.hgroup}>
        <Typography.Title className={style.title} level={4}>
          {group.label}
        </Typography.Title>
        <Typography.Text>{group.description}</Typography.Text>
      </hgroup>
      <div>
        {group.list.map((e) => (
          <ArrangementTemplateEntry
            singles={singles}
            active={active}
            key={e.label}
            entry={e}
            index={index}
            useOnClick={useOnClick}
            previewOnClick={previewOnClick}
          />
        ))}
      </div>
    </div>
  );
};
