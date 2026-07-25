import type { AnimateableStyles } from "_controllers/geometry/animator/animator.types.mjs";

export class KeyframeUtils {
  public static produceKeyframe({
    left,
    top,
    width,
    height,
    opacity,
    rotate,
    scale,
    offset,
    skewX,
    skewY,
    // rotate3d,
  }: AnimateableStyles): Keyframe {
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
}
