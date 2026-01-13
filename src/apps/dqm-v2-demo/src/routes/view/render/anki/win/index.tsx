import { createFileRoute } from "@tanstack/react-router";
import { AnkiWin } from "_displays/anki-win/AnkiWin";

export const Route = createFileRoute("/view/render/anki/win/")({
  component: AnkiWin,
});
