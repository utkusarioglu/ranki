import { useRef, type FC, type RefObject } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Button, Card, Flex, Typography } from "antd";
import {
  DragOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useAstViewStore } from "../../stores/ast-view/ast-view.store.mts";

export interface DraggableRowProps {
  type: string;
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
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: allowDragging ? "move" : "default",
        marginBottom: "0.5em",
      }}
      variant="borderless"
      size="small"
      ref={ref}
    >
      <Flex justify="space-between">
        <DragOutlined style={{ opacity: +allowDragging }} />
        <Typography.Text code>{text}</Typography.Text>
        <Button
          icon={visible ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          size="small"
          onClick={() => toggleVisible()}
        />
      </Flex>
    </Card>
  );
};

const DraggableRow: FC<DraggableRowProps> = ({
  type,
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
    type,
    item: () => ({ id, index }),
    canDrag: () => allowDragging,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // --- Drop target ---
  const [, drop] = useDrop({
    accept: type,
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
  list: "props" | "children" | "stable";
  method: "setProps" | "setChildren" | "setStable";
  allowDragging: boolean;
}

// @ts-expect-error ANKI
type FunctionKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

// @ts-expect-error ANKI
type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends Array<any> ? K : never;
}[keyof T];

export const ReorderList: FC<EditableReorderListProps> = ({
  list,
  method,
  allowDragging,
}) => {
  const code = useAstViewStore();

  const move = (from: number, to: number) => {
    const newItems = code[list];
    const [removed] = newItems.splice(from, 1);
    // @ts-ignore
    newItems.splice(to, 0, removed);
    // @ts-ignore
    code[method](newItems);
  };

  const toggleVisibleFac = (index: number) => {
    return () => {
      const newItems = [...code[list]];
      newItems[index] = {
        visible: !newItems[index].visible,
        id: newItems[index].id,
      };
      // @ts-ignore
      code[method](newItems);
    };
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {code[list].map((item, i) => (
        <DraggableRow
          type={list}
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
