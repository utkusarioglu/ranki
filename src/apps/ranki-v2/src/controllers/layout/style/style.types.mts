interface AnimatableStyles {
  top: number;
  left: number;
  width: number;
  height: number;
  opacity: number;
  offset: number;
  rotate: number;
  scale: number;
  skewX: number;
  skewY: number;
}

export type AnimatableStylesPartial = Partial<AnimatableStyles>;
