import { metrics } from "@opentelemetry/api";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";

import type { RankiMetricsRuntimeProps } from "./meter.types.mjs";

import { resource } from "../resource.mjs";

export class RankiMetrics {
  public static configure() {}

  public static enable(props: RankiMetricsRuntimeProps) {
    const exporter = new OTLPMetricExporter({
      url: props.endpoint,
    });

    const provider = new MeterProvider({
      readers: [
        new PeriodicExportingMetricReader({
          exporter,
          exportIntervalMillis: 5e3,
        }),
      ],
      resource,
      sdkMetricsEnabled: true,
    });

    metrics.setGlobalMeterProvider(provider);
  }
}
