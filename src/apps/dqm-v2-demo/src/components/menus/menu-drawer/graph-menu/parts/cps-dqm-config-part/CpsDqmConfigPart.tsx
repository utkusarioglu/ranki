import type { ICps } from "@dqm/package-dqm-api-v2";
import type { FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";

interface CpsDqmConfigPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsDqmConfigPart: FC<CpsDqmConfigPartProps> = ({ cps: p }) => {
  return (
    <>
      <SectionTitle parts={["code:ICps", "Dqm Config"]} />
      <TryCatchSourceCard
        topDescription={
          <Typography.Text>
            This is the object that the component hands to the parser
          </Typography.Text>
        }
        item={p.getDqmConfig()}
      />
    </>
  );
};
