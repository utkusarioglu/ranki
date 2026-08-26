import { AnkiWindows } from "_displays/anki-windows/AnkiWindows";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/render/anki/windows/")({
  component: AnkiWindows,
});
