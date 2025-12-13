import type { FC } from "react";
import type { WithIndex } from "./TemplatesDrawer";
import { Typography } from "antd";
import { TemplateEntry } from "./TemplateEntry";
import style from "./TemplateGroup.module.css";
import type { TemplateGroupWithList } from "../../stores/dqm/dqm.store.types.mts";

type TemplateGroupProps = WithIndex & {
  group: TemplateGroupWithList;
};

export const TemplateGroup: FC<TemplateGroupProps> = ({
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
          <TemplateEntry
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
