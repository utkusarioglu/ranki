import { type FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";

interface CpsComponentConfigPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsComponentConfig: FC<CpsComponentConfigPartProps> = ({
  cps: c,
}) => {
  return (
    <>
      <SectionTitle parts={["code:ICps", "Component Config"]} />
      <TryCatchSourceCard
        topDescription={
          <Typography.Text>
            This is the object that the component hands to the transformer
          </Typography.Text>
        }
        item={c.getComponentConfig()}
      />
    </>
  );
};
