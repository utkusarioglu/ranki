export interface RenderNodeLeaf {
  selector: string;
  component: string;
  element: HTMLElement;
}

export interface RenderNodeParent {
  selector: string;
  component: string;
  element: HTMLElement;
  inserts: {
    children: HTMLElement;
  };
}
