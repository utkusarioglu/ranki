import { Button, Typography } from "antd";
import { type FC } from "react";

import { OVERRIDES } from "./RenderSettings.constants.mts";
import type { AnkiRenderSettingsProps } from "./AnkiRenderSettings.types.mts";
import { TelemetryOverride } from "./TelemetryOverride";

export const AnkiRenderFetchSettings: FC<
  Pick<AnkiRenderSettingsProps, "store">
> = ({ store }) => {
  if (store.appVariant === "core") {
    return null;
  }

  return (
    <>
      <Typography>All Fetch Override</Typography>
      {OVERRIDES.map(({ mode, title }) => (
        <Button
          key={title}
          onClick={() => store.setFetchOverride("all", mode)}
          type={store.fetchOverride.all === mode ? "primary" : "default"}
        >
          {title}
        </Button>
      ))}
      <TelemetryOverride store={store} />
    </>
  );
};
