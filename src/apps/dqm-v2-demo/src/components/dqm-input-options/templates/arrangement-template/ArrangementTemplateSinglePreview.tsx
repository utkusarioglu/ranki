import type { FC } from "react";
import type { SingleTemplate } from "../single-template/SingleTemplate.types.mts";
import type { ArrangementTemplateSingleRef } from "./ArrangementTemplate.types.mts";
import style from "./ArrangementTemplateSinglePreview.module.css";
import { Typography } from "antd";
import { PreCode } from "../../../pre-code/PreCode";

interface ArrangementTemplateSinglePreviewProps {
  singleRef: ArrangementTemplateSingleRef;
  entry: SingleTemplate;
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
