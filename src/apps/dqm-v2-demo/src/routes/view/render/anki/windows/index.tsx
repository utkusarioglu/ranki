import { createFileRoute } from "@tanstack/react-router";
import { AnkiWindows } from "_displays/anki-windows/AnkiWindows";

export const Route = createFileRoute("/view/render/anki/windows/")({
  component: AnkiWindows,
});
