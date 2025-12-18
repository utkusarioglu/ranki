import type { FC, Ref } from "react";

export type EditableReorderListProps = WithComponent & {
  id: string;
  list: any[];
  onChange: (arr: any[]) => void;
  enableDrag: boolean;
};

// @ts-expect-error ANKI
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// @ts-expect-error ANKI
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

type WithComponent = {
  component: FC<DragCardProps>;
};

export type DragCardProps<T = any> = Pick<DraggableRowProps, "enableDrag"> & {
  isDragging: boolean;
  ref: Ref<HTMLDivElement>;
} & ItemProps<T>;

export type ItemProps<T = any> = {
  item: T;
  list: T[];
  onChange: (list: T[]) => void;
  index: number;
};

export type DraggableRowProps = WithComponent &
  ItemProps & {
    type: string;
    id: string;
    index: number;
    enableDrag: boolean;
    move: (from: number, to: number) => void;
  };
