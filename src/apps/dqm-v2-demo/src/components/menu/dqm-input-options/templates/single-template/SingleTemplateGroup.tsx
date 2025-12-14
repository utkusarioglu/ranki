import type { FC } from "react";
import type { WithIndexSingleTemplate } from "./SingleTemplate.types.mts";
import { Typography } from "antd";
import { SingleTemplateEntry } from "./SingleTemplateEntry";
import style from "./SingleTemplateGroup.module.css";
import type { SingleTemplateGroup as SingleTemplateGroupType } from "./SingleTemplate.types.mts";

type SingleTemplateGroupProps = WithIndexSingleTemplate & {
  group: SingleTemplateGroupType;
};

export const SingleTemplateGroup: FC<SingleTemplateGroupProps> = ({
  group,
  index,
  useOnClick,
  previewOnClick,
  active,
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
