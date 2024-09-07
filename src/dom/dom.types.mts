export type CreateElementOptions = {
  format: "text" | "html";
  content: string;
  className: string;
  style: string;
  children: HTMLElement[];
};

export type CreateElementChainOptions = {
  leaf: Partial<
    Pick<CreateElementOptions, "format" | "content" | "children" | "className">
  >;
  root: Partial<Pick<CreateElementOptions, "className">>;
};

export type CreateElementChainReturn = {
  leaf: HTMLElement;
  root: HTMLElement;
};
