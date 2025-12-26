import { type FC } from "react";
import { type PropertyTableRows } from "../../tables/PropertyTable";
import { SectionTitle } from "../../section-title/SectionTitle";
import { PropertyTable } from "../../tables/PropertyTable";
import type { ICps } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "_utils/sanitizer.mjs";
import { Typography } from "antd";
import { TryCatchView } from "_views/try-catch/try-catch";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import style from "./CpsParamChannelsPart.module.css";

interface CpsParamChannelsPartProps {
  cps: ClassSanitizer<ICps>;
}

export const CpsParamChannelsPart: FC<CpsParamChannelsPartProps> = ({
  cps: c,
}) => {
  const channelsPre = c.getChannels();
  if (channelsPre.state === "fail") {
    return <div>Channel collection failed</div>;
  }
  const channels = channelsPre.value;

  return (
    <>
      <SectionTitle>Channel Compilations</SectionTitle>
      <div>
        {channels.map((channel) => (
          <div key={channel}>
            <div className={style.title}>
              <Typography.Title level={5} code>
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
