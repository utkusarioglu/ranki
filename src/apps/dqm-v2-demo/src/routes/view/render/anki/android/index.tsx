import { AnkiAndroid } from "_displays/anki-android/AnkiAndroid";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/view/render/anki/android/")({
  component: AnkiAndroid,
});
