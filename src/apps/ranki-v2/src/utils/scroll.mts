export class Scroll {
  private static timeout: number;

  static delayed(
    element: HTMLElement | undefined,
    behavior: ScrollBehavior,
    latency: number,
  ) {
    const EVENTS = ["scroll", "wheel", "touchstart", "keydown"];
    return new Promise<void>((resolve) => {
      const cancel = () => {
        clearTimeout(this.timeout);
        resolve();
      };
      EVENTS.forEach((e) => {
        window.addEventListener(e, cancel, { once: true, passive: true });
      });
      if (this.timeout) {
        cancel();
      }
      this.timeout = setTimeout(() => {
        EVENTS.forEach((e) => {
          window.removeEventListener(e, cancel);
        });
        if (!element) {
          window.scrollTo({ top: 0, left: 0, behavior });
          return;
        }
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry.isIntersecting) {
              element.scrollIntoView({ behavior, block: "center" });
            }
            observer.disconnect();
          },
          {
            root: null,
            threshold: 0,
          },
        );

        observer.observe(element);
        resolve();
      }, latency);
    });
  }
}
