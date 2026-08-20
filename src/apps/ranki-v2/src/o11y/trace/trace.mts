import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { resource } from "../resource.mjs";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import type { RankiTracingRuntimeProps } from "./trace.types.mjs";

export class RankiTracing {
  public static configure() {}

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
