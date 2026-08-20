const emptyFunc = () => {};

const nullFunc = () => null;

const spanObj = {
  addEvent: emptyFunc,
  addLink: emptyFunc,
  end: emptyFunc,
  spanContext: nullFunc,
};

const withCtx =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (a: any, b: any) => {
    if (b) return b(spanObj);
    return a(spanObj);
  };

const spanMethod =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (_: any, v: any) => {
    return v({
      addEvent: emptyFunc,
      span: spanObj,
      withCtx,
    });
  };

export const O11yTracer = class {
  span = spanMethod;
};
