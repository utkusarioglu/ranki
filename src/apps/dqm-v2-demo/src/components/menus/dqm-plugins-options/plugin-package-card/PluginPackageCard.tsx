import type { PluginStoreWrapper } from "_stores/dqm/dqm.store.types.mjs";
import type { FC } from "react";

import { BlockySwitch } from "_views/blocky-switch/BlockySwitch";
import { SkinnyCard } from "_views/skinny-card/SkinnyCard";
import { Flex, Typography } from "antd";

import type {
  WithPluginActions,
  WithPluginPackageActions,
} from "../DqmPluginsOptions";

import { PluginMember } from "../plugin-card/PluginCard";
import style from "./PluginPackageCard.module.css";

type PluginCardProps = {
    pluginPackage: PluginStoreWrapper;
  } &
  WithPluginActions & WithPluginPackageActions;

export const PluginCard: FC<PluginCardProps> = ({
  pluginPackage: { enabled, name, packageIndex, plugins },
  setPluginAsInstalled,
  setPluginAsRequested,
  setPluginAsStandard,
  setPluginPackageAsEnabled,
}) => {
  return (
    <SkinnyCard>
      <Flex align="center" className={style.titleRow} justify="space-between">
        <Typography.Title className={style.title} level={4}>
          {name}
        </Typography.Title>
        <Flex justify="end">
          <BlockySwitch
            checkedChildren={"Enabled"}
            onChange={(e) => setPluginPackageAsEnabled(packageIndex, e)}
            unCheckedChildren={"Disabled"}
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
