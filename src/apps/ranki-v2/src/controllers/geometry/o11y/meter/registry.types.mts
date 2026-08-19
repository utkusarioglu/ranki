export type FormattedName = { type?: "FormattedName" } & string;

export type MeterType = "counter" | "gauge" | "histogram" | "upDownCounter";

export type RawName = { type?: "RawMetricName" } & string;
