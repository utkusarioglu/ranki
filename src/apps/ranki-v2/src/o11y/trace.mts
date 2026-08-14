/* document-load.ts|js file - the code snippet is the same for both the languages */
import {
  // SimpleSpanProcessor,
  // ConsoleSpanExporter,
  BatchSpanProcessor,
} from "@opentelemetry/sdk-trace-web";
import { WebTracerProvider } from "@opentelemetry/sdk-trace-web";
import { DocumentLoadInstrumentation } from "@opentelemetry/instrumentation-document-load";
import { ZoneContextManager } from "@opentelemetry/context-zone";
import { registerInstrumentations } from "@opentelemetry/instrumentation";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";

const exporter = new OTLPTraceExporter({
  url: "http://localhost:4318/v1/traces",
});

const provider = new WebTracerProvider({
  spanProcessors: [
    // new SimpleSpanProcessor(new ConsoleSpanExporter()),
    new BatchSpanProcessor(exporter),
  ],
});

provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});

// Registering instrumentations
registerInstrumentations({
  instrumentations: [new DocumentLoadInstrumentation()],
});
