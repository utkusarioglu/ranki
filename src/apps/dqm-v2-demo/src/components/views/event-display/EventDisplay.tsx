import type { RankiIframeEvent } from "_stores/anki-dist/anki.store.types.mjs";
import style from "./EventDisplay.module.css";
import type { FC } from "react";

interface EventsDisplayProps {
  events: RankiIframeEvent[];
}

export const EventsDisplay: FC<EventsDisplayProps> = ({ events }) => {
  return <div className={style.eventsDisplay}>{events.length}</div>;
};
