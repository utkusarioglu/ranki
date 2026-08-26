import type { FC } from "react";

import { Typography } from "antd";

import type { WithIndexSingleTemplate } from "./SingleTemplate.types.mts";
import type { SingleTemplateGroup as SingleTemplateGroupType } from "./SingleTemplate.types.mts";

import { SingleTemplateEntry } from "./SingleTemplateEntry";
import style from "./SingleTemplateGroup.module.css";

type SingleTemplateGroupProps = {
  group: SingleTemplateGroupType;
} & WithIndexSingleTemplate;

export const SingleTemplateGroup: FC<SingleTemplateGroupProps> = ({
  active,
  group,
  index,
  previewOnClick,
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
          <SingleTemplateEntry
            active={active}
            entry={e}
            index={index}
            key={e.label}
            previewOnClick={previewOnClick}
            useOnClick={useOnClick}
          />
        ))}
      </div>
    </div>
  );
};
