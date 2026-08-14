import type { DebugPause } from "./o11y.types.mjs";

const DEBUG_DELAY = 0;

export class O11y {
  public static async pause(props?: DebugPause) {
    const duration = props?.duration || DEBUG_DELAY;
    const details = props?.props || null;
    if (duration === 0) return Promise.resolve();
    if (details) console.log("DEBUG PAUSE: ", details);
    await new Promise<void>((r) =>
      setTimeout(() => {
        r();
      }, duration),
    );
  }

  // public static geometryControllerOnEmit({
  //   host,
  //   update,
  // }: GeometryControllerOnEmitProps) {
  //   if (host.tagName === DEBUG_TAG) {
  //     console.log("controller.onEmit", {
  //       tagName: host.tagName,
  //       update,
  //     });
  //   }
  // }

  // public static controllerInformSet(props: ControllerInformSet) {
  //   if (props.host.tagName === DEBUG_TAG) {
  //     console.log("controller.informSet", {
  //       tag: props.host.tagName,
  //       props: props.props,
  //     });
  //   }
  // }

  // public static informStyle(props: InformStyleDebug) {
  //   if (props.host.tagName === DEBUG_TAG) {
  //     console.log("controller.informStyle", {
  //       tag: props.host.tagName,
  //       curr: props.curr,
  //       prev: props.prev,
  //       sizing: props.sizing,
  //       informed: props.informed,
  //     });
  //   }
  // }

  // public static informSet(props: InformSet) {
  //   if (props.e.tagName === DEBUG_TAG) {
  //     console.log("watcherset.informSet", {
  //       tag: props.host.tagName,
  //       e: props.e,
  //       informed: props.informed,
  //       props: props.props,
  //     });
  //   }
  // }

  // public static animatorUpdate(props: AnimatorUpdate) {
  //   if (props.host.tagName === DEBUG_TAG)
  //     console.log("animator.update", {
  //       host: props.host,
  //       curr: props.curr,
  //       prev: props.prev,
  //     });
  // }

  // public static animatorUpdateComposed({
  //   host,
  //   parsed,
  // }: AnimatorUpdateComposedProps) {
  //   if (host.tagName === DEBUG_TAG)
  //     console.log("animator.update.composed", {
  //       parsed,
  //     });
  // }

  // public static animatorPlayName({
  //   host,
  //   finalKeyframes,
  //   finalOptions,
  // }: AnimatorPlayNameProps) {
  //   if (host.tagName === DEBUG_TAG)
  //     console.log("animator.playName", {
  //       finalKeyframes,
  //       finalOptions,
  //     });
  // }
}
