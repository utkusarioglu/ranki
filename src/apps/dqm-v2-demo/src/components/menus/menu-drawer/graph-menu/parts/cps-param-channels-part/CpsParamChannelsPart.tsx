import { type FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import style from "./CpsParamChannelsPart.module.css";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";
import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";

interface CpsParamChannelsPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsParamChannelsPart: FC<CpsParamChannelsPartProps> = ({
  cps: c,
}) => {
  const channelsPre = c.getChannels();
  if (channelsPre.state === "fail") {
    return (
      <ExceptionCard>
        <Typography.Text code>ICpsParam</Typography.Text> channels list
        retrieval failed
      </ExceptionCard>
    );
  }
  const channels = channelsPre.value;

  return (
    <>
      <SectionTitle>Channel Compilations</SectionTitle>
      <div>
        {channels.map((channel) => (
          <TryCatchSourceCard
            key={channel}
            topDescription={
              <Typography.Title level={5} code className={style.channelName}>
                {channel}
              </Typography.Title>
            }
            item={c.getChannelCompilation(channel)}
          />
        ))}
      </div>
    </>
  );
};
