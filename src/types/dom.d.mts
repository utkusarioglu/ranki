export type CreateElementOptions = {
  format: "text" | "html";
  content: string;
  className: string;
  style: string;
  children: Node[];
};

export type CreateElementChainOptions = {
  leaf: Pick<CreateElementOptions, "format" | "content">;
};

export type CreateElementChainReturn = {
  leaf: HTMLElement;
  root: HTMLElement;
};
