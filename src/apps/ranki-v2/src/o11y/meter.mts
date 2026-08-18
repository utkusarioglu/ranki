import { metrics } from "@opentelemetry/api";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";

const exporter = new OTLPMetricExporter({
  url: "/api/v1/otlp/v1/metrics",
});

const provider = new MeterProvider({
  readers: [
    new PeriodicExportingMetricReader({
      exporter,
      exportIntervalMillis: 5e3,
    }),
  ],
});

metrics.setGlobalMeterProvider(provider);
