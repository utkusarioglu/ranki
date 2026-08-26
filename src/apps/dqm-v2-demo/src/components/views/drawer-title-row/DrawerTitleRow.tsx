import { useUiStore } from "_stores/ui/ui.store.mts";
import { TitleRow } from "_views/title-row/TitleRow";
import { CloseOutlined } from "@ant-design/icons";
import { Button, Typography } from "antd";
import { type FC, type PropsWithChildren } from "react";

import style from "./DrawerTitleRow.module.css";

export const DrawerTitleRow: FC<PropsWithChildren> = ({ children }) => {
  const ui = useUiStore();
  return (
    <TitleRow isAbsolute={false}>
      <Typography.Title className={style.title} level={3}>
        {children}
      </Typography.Title>
      <Button
        onClick={() => {
          // code.setArrangementFromHistory(0);
          ui.setTemplateDrawerState(null);
        }}
        variant="link"
      >
        <CloseOutlined />
      </Button>
    </TitleRow>
  );
};

export const DrawerTitleCode: FC<PropsWithChildren> = ({ children }) => (
  <Typography.Title className={style.code} code level={3}>
    {children}
  </Typography.Title>
);
