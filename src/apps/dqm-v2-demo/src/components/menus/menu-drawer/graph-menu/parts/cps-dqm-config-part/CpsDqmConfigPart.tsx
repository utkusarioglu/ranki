import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import type { FC } from "react";

import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";
import { Typography } from "antd";

import { SectionTitle } from "../../section-title/SectionTitle";

interface CpsDqmConfigPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsDqmConfigPart: FC<CpsDqmConfigPartProps> = ({ cps: p }) => {
  return (
    <>
      <SectionTitle parts={["code:ICps", "Dqm Config"]} />
      <TryCatchSourceCard
        item={p.getDqmConfig()}
        topDescription={
          <Typography.Text>
            This is the object that the component hands to the parser
          </Typography.Text>
        }
      />
    </>
  );
};
