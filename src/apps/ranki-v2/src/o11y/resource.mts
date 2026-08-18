import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";

export const resource = resourceFromAttributes({
  [ATTR_SERVICE_NAME]: "ranki",
  [ATTR_SERVICE_VERSION]: "2.0.0",
  "app.runtime.webview.variant": "unknown",
});
