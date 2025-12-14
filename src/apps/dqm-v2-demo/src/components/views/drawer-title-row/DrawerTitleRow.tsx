import { CloseOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { type FC, type PropsWithChildren } from "react";
import style from "./DrawerTitleRow.module.css";
import { useUiStore } from "_stores/ui/ui.store.mts";
import { TitleRow } from "_views/title-row/TitleRow";

export const DrawerTitleRow: FC<PropsWithChildren> = ({ children }) => {
  const ui = useUiStore();
  return (
    <TitleRow>
      <Typography.Title className={style.title} level={3}>
        {children}
      </Typography.Title>
      <Button
        variant="link"
        onClick={() => {
          // code.setArrangementFromHistory(0);
          ui.setTemplateDrawerState(null);
        }}
      >
        <CloseOutlined />
      </Button>
    </TitleRow>
  );
};
