import { metrics } from "@opentelemetry/api";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import {
  MeterProvider,
  PeriodicExportingMetricReader,
} from "@opentelemetry/sdk-metrics";

import type { RankiMeteringRuntimeProps } from "./ranki-metering.types.mjs";

import { resource } from "../resource.mjs";

export class RankiMetering {
  public static enable(props: RankiMeteringRuntimeProps) {
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
