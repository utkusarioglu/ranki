import { type FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import style from "./CpsParamChannelsPart.module.css";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";
import { tryCatch } from "_utils/utils.mjs";

interface CpsParamChannelsPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsParamChannelsPart: FC<CpsParamChannelsPartProps> = ({
  cps: c,
}) => {
  const paramsPre = c.getParams();
  if (paramsPre.state === "fail") {
    return (
      <ExceptionCard>
        <Typography.Text code>ICps</Typography.Text> param retrieval failed
      </ExceptionCard>
    );
  }
  const params = paramsPre.value;

  return (
    <>
      <SectionTitle>Mutation entries</SectionTitle>
      <div>
        {params.map((param) => (
          <TryCatchSourceCard
            key={param.getIdString()}
            topDescription={
              <Typography.Text className={style.channelName}>
                <Typography.Text code>{param.getIdString()}</Typography.Text>
                {param.isCoupled() ? "is" : "is not"} coupled.
              </Typography.Text>
            }
            item={tryCatch("mutationEntries", () => param.getMutationEntries())}
          />
        ))}
      </div>
    </>
  );
};
