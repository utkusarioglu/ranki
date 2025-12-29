import { type FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";

interface CpsComponentConfigPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsComponentConfig: FC<CpsComponentConfigPartProps> = ({
  cps: c,
}) => {
  const configPre = c.getComponentConfig();
  if (configPre.state === "fail") {
    console.log(configPre);
    return (
      <ExceptionCard>
        <Typography.Text code>ICps</Typography.Text> component config retrieval
        failed
      </ExceptionCard>
    );
  }
  const channels = configPre.value;

  return (
    <>
      <SectionTitle>Channel Compilations</SectionTitle>
      <YamlDisplay obj={channels as any} />
    </>
  );
};
