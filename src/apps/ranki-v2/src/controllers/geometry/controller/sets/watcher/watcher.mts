import type { LitElement } from "lit";
import type { GeometryWatcherRecord } from "./watcher.types.mjs";

export class GeometryWatchers<Instance extends LitElement> {
  private readonly host: Instance;
  private readonly props: GeometryWatcherRecord<Instance>;

  constructor(host: Instance, props: GeometryWatcherRecord<Instance>) {
    this.host = host;
    this.props = props;
    console.log(this.host, this.props);
  }
}
