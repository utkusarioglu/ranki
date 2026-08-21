import { ZoneContextManager } from "@opentelemetry/context-zone";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";

import type { RankiTracingRuntimeProps } from "./ranki-tracing.types.mjs";

import { resource } from "../resource.mjs";

export class RankiTracing {
  public static enable(props: RankiTracingRuntimeProps) {
    const exporter = new OTLPTraceExporter({ url: props.endpoint });

    const provider = new WebTracerProvider({
      resource,
      spanProcessors: [new BatchSpanProcessor(exporter)],
    });

    provider.register({
      contextManager: new ZoneContextManager(),
    });

    registerInstrumentations({
      instrumentations: [new DocumentLoadInstrumentation()],
    });
  }
}
