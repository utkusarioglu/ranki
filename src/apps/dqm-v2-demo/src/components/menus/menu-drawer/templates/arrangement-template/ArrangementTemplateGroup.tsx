import type { FC } from "react";

import { Typography } from "antd";

import type { SingleTemplateGroup } from "../single-template/SingleTemplate.types.mts";
import type {
  ArrangementTemplateGroup as ArrangementTemplateGroupType,
  WithIndexArrangementTemplates,
} from "./ArrangementTemplate.types.mts";

import { ArrangementTemplateEntry } from "./ArrangementTemplateEntry";
import style from "./ArrangementTemplateGroup.module.css";

type TemplateGroupProps = {
  group: ArrangementTemplateGroupType;
  singles: SingleTemplateGroup[];
} & WithIndexArrangementTemplates;

export const ArrangementTemplateGroup: FC<TemplateGroupProps> = ({
  active,
  group,
  index,
  previewOnClick,
  singles,
  useOnClick,
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
            active={active}
            entry={e}
            index={index}
            key={e.label}
            previewOnClick={previewOnClick}
            singles={singles}
            useOnClick={useOnClick}
          />
        ))}
      </div>
    </div>
  );
};
