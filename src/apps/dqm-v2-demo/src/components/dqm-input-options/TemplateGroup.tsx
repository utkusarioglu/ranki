import type { FC } from "react";
import type { TemplateGroupWithList } from "../../stores/code/utils.mts";
import type { WithIndex } from "./TemplatesDrawer";
import { Typography } from "antd";
import { TemplateEntry } from "./TemplateEntry";
import style from "./TemplateGroup.module.css";

type TemplateGroupProps = WithIndex & {
  group: TemplateGroupWithList;
};

export const TemplateGroup: FC<TemplateGroupProps> = ({
  group,
  index,
  onClick,
  active,
}) => {
  return (
    <div className={style.container}>
      <hgroup className={style.hgroup}>
        <Typography.Title level={3}>{group.label}</Typography.Title>
        <Typography.Text>{group.description}</Typography.Text>
      </hgroup>
      <div>
        {group.list.map((e) => (
          <TemplateEntry
            active={active}
            key={e.label}
            entry={e}
            index={index}
            onClick={onClick}
          />
        ))}
      </div>
    </div>
  );
};
