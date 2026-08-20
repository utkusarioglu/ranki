import { metrics } from "@opentelemetry/api";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { resource } from "./resource.mjs";

export interface RankiMetricsRuntimeProps {
  endpoint: string;
}

export class RankiMetrics {
  public static configure() {}

  public static enable(props: RankiMetricsRuntimeProps) {
    const exporter = new OTLPMetricExporter({
      url: props.endpoint,
    });

    const provider = new MeterProvider({
      sdkMetricsEnabled: true,
      resource,
      readers: [
        new PeriodicExportingMetricReader({
          exporter,
          exportIntervalMillis: 5e3,
        }),
      ],
    });

    metrics.setGlobalMeterProvider(provider);
  }
}
