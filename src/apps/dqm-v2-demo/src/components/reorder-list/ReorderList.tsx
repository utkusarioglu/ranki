import { useRef, type FC, type RefObject } from "react";
import { Card, Button, Text, Code } from "@blueprintjs/core";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCodeStore, type CodeStore } from "../../stores/code.store.mts";

const ItemType = {
  ROW: "ROW",
};

export interface DraggableRowProps {
  id: string;
  index: number;
  text: string;
  visible: boolean;
  allowDragging: boolean;
  move: (from: number, to: number) => void;
  toggleVisible: () => void;
}

type DragCardProps = Pick<
  DraggableRowProps,
  "visible" | "toggleVisible" | "text" | "allowDragging"
> & {
  isDragging: boolean;
  ref: RefObject<HTMLDivElement | null>;
};

const DragCard: FC<DragCardProps> = ({
  isDragging,
  ref,
  visible,
  text,
  toggleVisible,
  allowDragging,
}) => {
  return (
    <Card
      elevation={isDragging ? 3 : 1}
      style={{
        opacity: isDragging ? 0.4 : 1,
        marginBottom: 8,
        padding: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        cursor: allowDragging ? "move" : "default",
      }}
      ref={ref}
    >
      <div style={{ padding: "0 8px", width: "1em" }}>
        {allowDragging ? "☰" : ""}
      </div>

      <Code>{text}</Code>

      <Button
        icon={visible ? "eye-on" : "eye-off"}
        size="small"
        onClick={() => toggleVisible()}
      />
    </Card>
  );
};

const DraggableRow: FC<DraggableRowProps> = ({
  id,
  index,
  move,
  text,
  visible,
  toggleVisible,
  allowDragging,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  // --- Drag source ---
  const [{ isDragging }, drag] = useDrag({
    type: ItemType.ROW,
    item: { id, index },
    canDrag: () => allowDragging,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // --- Drop target ---
  const [, drop] = useDrop({
    accept: ItemType.ROW,
    hover(item: any, monitor) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) return;

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Move only when cursor crosses half the item
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      move(dragIndex, hoverIndex);
      item.index = hoverIndex; // mutate index inside monitor item
    },
  });

  drag(drop(ref));

  return (
    <DragCard
      allowDragging={allowDragging}
      ref={ref}
      isDragging={isDragging}
      text={text}
      visible={visible}
      toggleVisible={toggleVisible}
    />
  );
};

interface EditableReorderListProps {
  list: ArrayKeys<CodeStore>;
  method: FunctionKeys<CodeStore>;
  allowDragging: boolean;
}

// ANKI
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// ANKI
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

export const ReorderList: FC<EditableReorderListProps> = ({
  list,
  method,
  allowDragging,
}) => {
  const code = useCodeStore();

  const move = (from: number, to: number) => {
    const newItems = code[list];
    const [removed] = newItems.splice(from, 1);
    newItems.splice(to, 0, removed);
    code[method](newItems);
  };

  const toggleVisibleFac = (index: number) => {
    return () => {
      const newItems = [...code[list]];
      newItems[index] = {
        visible: !newItems[index].visible,
        id: newItems[index].id,
      };
      code[method](newItems);
    };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {code[list]
        // @ts-expect-error code[list] is not inferred
        .map((item, i) => (
          <DraggableRow
            allowDragging={allowDragging}
            key={i}
            id={item.id}
            index={i}
            text={item.id}
            move={move}
            visible={item.visible}
            toggleVisible={toggleVisibleFac(i)}
          />
        ))}
    </DndProvider>
  );
};
