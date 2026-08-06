import type { AnimationKeyframeStyles } from "../animator.types.mjs";

export class KeyframeUtils {
  public static optionsDefaults: KeyframeAnimationOptions = {
    // easing: "linear",
    easing: "ease-in-out",
    // easing: "cubic-bezier(0.6, -1, 0.2, 2.4)",
    fill: "both",
  };

  public static produceKeyframe({
    height,
    left,
    offset,
    opacity,
    rotate,
    scale,
    skewX,
    skewY,
    top,
    width,
    // rotate3d,
  }: AnimationKeyframeStyles): Keyframe {
    const k: Keyframe = {};
    const transform = [
      [left, `translateX(${left}px)`],
      [top, `translateY(${top}px)`],
      [skewX, `skewX(${skewX}deg)`],
      [skewY, `skewY(${skewY}deg)`],
      // [rotate3d, `rotate3d${(rotate3d || "").split(" ").join(", ")}deg`],
    ]
      .filter((v) => !!v[0])
      .map((v) => v[1]);

    if (transform.length) k.transform = transform.join(" ");
    if (width !== undefined) k.width = width + "px";
    if (height !== undefined) k.height = height + "px";
    if (rotate !== undefined) k.rotate = rotate + "deg";
    if (scale !== undefined) k.scale = scale;
    if (opacity !== undefined) k.opacity = opacity;
    if (offset !== undefined) k.offset = offset;

    return k;
  }

  public static produceKeyframes(keyframes: AnimationKeyframeStyles[]) {
    return keyframes.map((k) => this.produceKeyframe(k));
  }
}
