import { createFileRoute } from "@tanstack/react-router";
import { AnkiDesktop } from "_displays/anki-desktop/AnkiDesktop.tsx";

export const Route = createFileRoute("/view/render/anki-desktop/")({
  component: AnkiDesktop,
});
