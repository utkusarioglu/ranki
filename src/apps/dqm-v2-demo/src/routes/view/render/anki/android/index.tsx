import { createFileRoute } from "@tanstack/react-router";
import { AnkiAndroid } from "_displays/anki-android/AnkiAndroid";

export const Route = createFileRoute("/view/render/anki/android/")({
  component: AnkiAndroid,
});
