export interface RenderNodeLeaf {
  selector: string;
  component: string;
  element: HTMLElement | Text;
}

export interface RenderNodeParent {
  selector: string;
  component: string;
  element: HTMLElement;
  inserts: {
    children: HTMLElement;
  };
}
