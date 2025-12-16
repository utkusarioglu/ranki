import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { Flex, Typography } from "antd";
import type { FC } from "react";
import { PluginMember } from "../plugin-card/PluginCard";
import style from "./PluginPackageCard.module.css";
import type {
  WithPluginPackageActions,
  WithPluginActions,
} from "../DqmPluginsOptions";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";

type PluginCardProps = WithPluginActions &
  WithPluginPackageActions & {
    pluginPackage: PluginStoreWrapper;
  };

export const PluginCard: FC<PluginCardProps> = ({
  pluginPackage: { name, packageIndex, enabled, plugins },
  setPluginAsInstalled,
  setPluginPackageAsEnabled,
  setPluginAsRequested,
  setPluginAsStandard,
}) => {
  return (
    <SkinnyCard>
      <Flex justify="space-between" align="center" className={style.titleRow}>
        <Typography.Title className={style.title} level={4}>
          {name}
        </Typography.Title>
        <Flex justify="end">
          <BlockySwitch
            checkedChildren={"Enabled"}
            unCheckedChildren={"Disabled"}
            onChange={(e) => setPluginPackageAsEnabled(packageIndex, e)}
            value={enabled}
          />
        </Flex>
      </Flex>
      <div>
        {plugins.map((plugin) => (
          <PluginMember
            key={plugin.pluginType + plugin.name}
            plugin={plugin}
            setPluginAsInstalled={setPluginAsInstalled}
            setPluginAsRequested={setPluginAsRequested}
            setPluginAsStandard={setPluginAsStandard}
          />
        ))}
      </div>
    </SkinnyCard>
  );
};
