import { useDqmStore } from "_stores/dqm/dqm.store.mjs";
import { useUiStore } from "_stores/ui/ui.store.mjs";
import { EventsDisplay } from "_views/event-display/EventDisplay";
import { useEffect, useRef, type FC, type ReactNode } from "react";

import { useAnkiTelemetry } from "_stores/anki-dist/anki-telemetry.mjs";
import type { AnkiDistStore } from "_stores/anki-dist/anki.store.types.mjs";
import { Send } from "./utils/send.mts";
import { AnkiScreen } from "./screen/AnkiScreen";

interface AnkiDeviceProps {
  type: "windows" | "android";
  platform: AnkiDistStore;
  Bottom: ReactNode;
  Top: ReactNode;
  src: string; // url
  srcFilters: string[]; // css selector
  deviceClassName: string;
}

export const AnkiDevice: FC<AnkiDeviceProps> = ({
  platform,
  Top,
  Bottom,
  src,
  srcFilters,
  type,
  deviceClassName,
}) => {
  const ref = useRef<HTMLIFrameElement>(null);
  const dqm = useDqmStore();
  const telemetry = useAnkiTelemetry();
  const ui = useUiStore();

  useEffect(() => {
    Send.changes(platform, dqm, ref);
  }, [ref, dqm, platform]);

  return (
    <>
      <AnkiScreen
        appVariant={platform.appVariant}
        aspect={platform.previewAspect}
        Bottom={Bottom}
        Top={Top}
        fetchOverride={platform.fetchOverride}
        deviceClassName={deviceClassName}
        onEvent={(e) => telemetry.addEvent(type, e)}
        onLoad={() => Send.changes(platform, dqm, ref)}
        ref={ref}
        reservedWidth={ui.menuWidth}
        scale={platform.previewScale}
        src={src}
        srcFilters={srcFilters}
      />
      <EventsDisplay events={telemetry.events} />
    </>
  );
};
