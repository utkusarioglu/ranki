import type { CreateElementChainOptions, CreateElementChainReturn, CreateElementOptions } from "./html.types.mjs";
export type Tags = string[];
export declare class Html {
    _assignElementContent(elem: HTMLElement | undefined, content: string | undefined, format?: string): void;
    _appendElementChildren(elem: HTMLElement | undefined, children?: HTMLElement[]): void;
    _assignElemClassName(elem: HTMLElement | undefined, className: string | undefined): void;
    single<Root extends HTMLElement>(tag: string, { format, content, className, style, children, }?: Partial<CreateElementOptions>): HTMLElement;
    chain<Root extends HTMLElement, Leaf extends HTMLElement>(tags: Tags, { leaf, root }?: Partial<CreateElementChainOptions>): CreateElementChainReturn<Root, Leaf>;
    toString(elem: HTMLElement): string;
}
