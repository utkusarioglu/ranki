import type { ICps } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import {
  SectionTitle,
  SectionTitleCode,
} from "../../section-title/SectionTitle";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { Typography } from "antd";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";

interface GraphMenuMergedConfigPartProps {
  cps: ClassSanitizer<ICps>;
}

export const GraphMenuCpsMergedConfigPart: FC<
  GraphMenuMergedConfigPartProps
> = ({ cps: p }) => {
  return (
    <>
      <SectionTitle>
        <SectionTitleCode>ICps</SectionTitleCode> Merged Config
      </SectionTitle>
      <TryCatchSourceCard
        topDescription={
          <Typography.Text>
            This is the configuration used for creating the parser for this{" "}
            <Typography.Text code>Cps</Typography.Text> instance
          </Typography.Text>
        }
        item={p.getMergedConfig()}
      />
    </>
  );
};
