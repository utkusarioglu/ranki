import type { FC, Ref } from "react";

export type DragCardProps<T = any> = {
  isDragging: boolean;
  ref: Ref<HTMLDivElement>;
} & ItemProps<T> & Pick<DraggableRowProps, "enableDrag">;

export type DraggableRowProps = WithComponent &
  ItemProps & {
    enableDrag: boolean;
    id: string;
    index: number;
    move: (from: number, to: number) => void;
    type: string;
  };

export type EditableReorderListProps = WithComponent & {
  enableDrag: boolean;
  id: string;
  list: any[];
  onChange: (arr: any[]) => void;
};

export type ItemProps<T = any> = {
  index: number;
  item: T;
  list: T[];
  onChange: (list: T[]) => void;
};

// @ts-expect-error ANKI
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

// @ts-expect-error ANKI
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type WithComponent = {
  component: FC<DragCardProps>;
};
