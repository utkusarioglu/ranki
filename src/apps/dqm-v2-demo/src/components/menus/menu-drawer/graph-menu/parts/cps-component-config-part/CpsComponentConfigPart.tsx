import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";

import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";
import { Typography } from "antd";
import { type FC } from "react";

import { SectionTitle } from "../../section-title/SectionTitle";

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
        item={c.getComponentConfig()}
        topDescription={
          <Typography.Text>
            This is the object that the component hands to the transformer
          </Typography.Text>
        }
      />
    </>
  );
};
