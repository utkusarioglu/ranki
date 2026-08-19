const emptyFunc = () => {};
const nullFunc = () => null;

const span = {
  spanContext: nullFunc,
  end: emptyFunc,
  addEvent: emptyFunc,
  addLink: emptyFunc,
};

export const O11yTracer = class {
  span(_: any, v: any) {
    return v({
      span,
      addEvent: emptyFunc,
      withCtx: (a: any, b: any) => {
        if (b) return b(span);
        return a(span);
      },
    });
  }
};
