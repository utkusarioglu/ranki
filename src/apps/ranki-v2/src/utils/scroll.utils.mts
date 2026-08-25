export class ScrollUtils {
  private static timeout: ReturnType<typeof setTimeout>;

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
          window.scrollTo({ behavior, left: 0, top: 0 });
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

  static async temporaryHide(duration: number) {
    return new Promise<void>((resolve) => {
      const SCROLL_HIDDEN = "scroll-hidden";
      const els = [document.body, document.querySelector("html")!];
      els.forEach((e) => e.classList.add(SCROLL_HIDDEN));
      setTimeout(() => {
        els.forEach((e) => e.classList.remove(SCROLL_HIDDEN));
        resolve();
      }, duration);
    });
  }
}
