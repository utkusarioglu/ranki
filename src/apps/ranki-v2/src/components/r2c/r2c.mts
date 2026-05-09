import { LitElement } from "lit";

export type ListenChildrenEventFunc = (e: ListenChildrenEvent) => void;

export type ListenChildrenEvent = CustomEvent<{ rect: Dims; detail: any }>;

export type Dims = { width: number; height: number };

export type Pos = { top: number; left: number };

export class R2C extends LitElement {
  // protected ch: R2C[] = [];
  protected dims: Dims[] = [];

  protected emitChildLoad(rect: Dims, detail: CustomEvent["detail"]) {
    // const rect = this.getBoundingClientRect();
    const evt = new CustomEvent("child-load", {
      detail: {
        rect,
        extra: detail,
      },
      // detail,
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(evt);
  }

  protected waitChildrenDims(children: R2C[], then: (d: Dims[]) => void) {
    const newNulls = () => Array(children.length).fill(null);
    this.dims = newNulls();
    this.addEventListener("child-load", (e) => {
      const first = e.composedPath()[0] as R2C;
      if (first === this) return;
      e.stopPropagation();
      // if (!this.ch.includes(first)) {
      //   this.ch.push(first);
      // }
      const index = children.indexOf(first);
      if (index === -1) return;
      this.dims.splice(index, 1, (e as ListenChildrenEvent).detail.rect);

      const isIncomplete = this.dims.some((v) => v === null);
      if (isIncomplete) return;

      then([...this.dims]);
      this.dims = newNulls();
      // if (children.includes(first)) {
      //   this.ch.push(first);
      // }
      // then(e as ListenChildrenEvent);
    });
  }

  public setChildrenPosition(children: R2C[], pos: Pos) {
    children.forEach((f) => {
      f.setPosition(pos);
    });
  }

  public setPosition(pos: Pos) {
    this.animate(
      [
        {
          translate: `${pos.left}px ${pos.top}px`,
        },
      ],
      {
        duration: 1000,
        fill: "both",
      },
    );
  }
}
