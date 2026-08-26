import type { FC } from "react";

import { PreCode } from "_views/pre-code/PreCode";
import { Typography } from "antd";

import type { SingleTemplate } from "../single-template/SingleTemplate.types.mts";
import type { ArrangementTemplateSingleRef } from "./ArrangementTemplate.types.mts";

import style from "./ArrangementTemplateSinglePreview.module.css";

interface ArrangementTemplateSinglePreviewProps {
  entry: SingleTemplate;
  singleRef: ArrangementTemplateSingleRef;
}

export const ArrangementTemplateSinglePreview: FC<
  ArrangementTemplateSinglePreviewProps
> = ({ entry, singleRef }) => (
  <div>
    <div className={style.title}>
      <Typography.Text type="secondary">
        Theater {singleRef.theater}
      </Typography.Text>
    </div>
    <PreCode className={style.sample}>{entry.raw}</PreCode>
  </div>
);
