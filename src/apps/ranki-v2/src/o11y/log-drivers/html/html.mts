import type { LogDriver, LogValue } from "_/o11y/log/ranki-logging.types.mjs";
import type {
  HtmlLogDriverConfigureProps,
  HtmlLogDriverConstructorParams,
  HtmlLogDriverStaticConfig,
} from "./html.types.mjs";
import { assertNotUndefined } from "_error/assertions.mjs";

export class HtmlLogDriver implements LogDriver {
  private container: HTMLDivElement;
  private sanitizerName: string = "none";
  private static config: HtmlLogDriverStaticConfig = {
    sanitizers: {
      none: (v) => v as LogValue[],
    },
  };

  public static configure(conf: HtmlLogDriverConfigureProps) {
    this.config.sanitizers = { ...this.config.sanitizers, ...conf.sanitizers };
  }

  constructor(params: HtmlLogDriverConstructorParams) {
    if (params?.sanitizer) this.sanitizerName = params.sanitizer;
    this.container = document.createElement("p");
    this.container.classList.add("html-log-driver");
    this.container.style.borderColor = "#440000";
    this.container.style.position = "fixed";
    this.container.style.left = "50vw";
    this.container.style.top = "0";
    this.container.style.width = "50vw";
    this.container.style.height = "50vh";
    this.container.style.overflowY = "scroll";

    setTimeout(() => {
      document.body.appendChild(this.container);
    }, 3000);
  }

  private getSanitizer() {
    const sanitizer = HtmlLogDriver.config.sanitizers[this.sanitizerName];
    assertNotUndefined(sanitizer, {
      details: {
        printerName: this.sanitizerName,
        printers: HtmlLogDriver.config.sanitizers,
      },
      why: "undefined printer",
    });
    return sanitizer;
  }

  log(v: LogValue) {
    const elem = document.createElement("pre");
    const sanitizer = this.getSanitizer();
    const sanitized = sanitizer(v as LogValue[]);
    elem.innerHTML = JSON.stringify(sanitized, null, 2);
    elem.style.color = "#005544";
    this.container.appendChild(elem);
  }

  getDomElement() {
    return this.container;
  }
}
