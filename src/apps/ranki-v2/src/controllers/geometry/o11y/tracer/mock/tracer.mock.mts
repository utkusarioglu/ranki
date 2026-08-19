export const O11yTracer = class {
  span(_: any, v: any) {
    return v({
      span: {
        spanContext: () => null,
        end: () => {},
        addEvent: () => {},
      },
      addEvent: () => {},
      withCtx: (a: any, b: any) => {
        if (b) return b();
        return a();
      },
    });
  }
};
