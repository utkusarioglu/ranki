import { BatchSpanProcessor } from "@opentelemetry/sdk-trace-web";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { resource } from "./resource.mjs";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

interface RankiTracingStaticConfig {
  url: string;
}

export class RankiTracing {
  private static config: RankiTracingStaticConfig;

  public static configure(config: RankiTracingStaticConfig) {
    this.config = config;
  }

  public static initialize() {
    const exporter = new OTLPTraceExporter({ url: this.config.url });

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
