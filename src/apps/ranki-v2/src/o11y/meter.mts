import { metrics } from "@opentelemetry/api";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { resource } from "./resource.mjs";

interface RankiMetricsStaticConfig {
  url: string;
}

export class RankiMetrics {
  private static config: RankiMetricsStaticConfig = {
    url: "/api/v1/otlp/v1/metrics",
  };

  public static configure(config: RankiMetricsStaticConfig) {
    this.config = config;
  }

  public static initialize() {
    const exporter = new OTLPMetricExporter({
      url: this.config.url,
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
