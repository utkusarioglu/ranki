import { type FC } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import { TryCatchView } from "_views/try-catch/try-catch";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import style from "./CpsParamChannelsPart.module.css";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";

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
          <div key={channel} className={style.channelCard}>
            <div className={style.title}>
              <Typography.Title level={5} code className={style.channel}>
                {channel}
              </Typography.Title>
            </div>
            <TryCatchView
              item={c.getChannelCompilation(channel)}
              Success={({ item }) => (
                <div className={style.code}>
                  <YamlDisplay
                    // @ts-expect-error
                    obj={item.value}
                  />
                </div>
              )}
            />
          </div>
        ))}
      </div>
    </>
  );
};
