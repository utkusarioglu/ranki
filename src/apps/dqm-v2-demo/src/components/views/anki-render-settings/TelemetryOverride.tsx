import { FETCH_RULES } from "_views/anki-screen/on-fetch/on-fetch.constants.mjs";
import { Button, Typography } from "antd";
import { type FC } from "react";

import { OVERRIDES } from "./RenderSettings.constants.mts";
import type { TelemetryOverrideProps } from "./AnkiRenderSettings.types.mts";

export const TelemetryOverride: FC<TelemetryOverrideProps> = ({ store }) => {
  if (store.fetchOverride.all !== "passthru") {
    return null;
  }

  return (
    <>
      {FETCH_RULES.map(({ title, type }) => (
        <div key={title}>
          <Typography>{title} Fetch Override</Typography>
          {OVERRIDES.map(({ mode, title }) => (
            <Button
              key={title}
              onClick={() => store.setFetchOverride(type, mode)}
              type={store.fetchOverride[type] === mode ? "primary" : "default"}
            >
              {title}
            </Button>
          ))}
        </div>
      ))}
    </>
  );
};
