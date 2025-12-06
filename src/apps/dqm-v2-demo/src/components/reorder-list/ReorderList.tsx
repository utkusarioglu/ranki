import { useRef, type FC, type RefObject } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useCodeStore } from "../../stores/code/code.store.mts";
import { Button, Card, Flex, Typography } from "antd";
import {
  DragOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from "@ant-design/icons";

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
      // elevation={isDragging ? 3 : 1}
      style={{
        opacity: isDragging ? 0.4 : 1,
        // marginBottom: 8,
        // padding: 8,
        // display: "flex",
        // alignItems: "center",
        // justifyContent: "space-between",
        // gap: 10,
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
  list: "astDragProps" | "astLineageProps" | "astNoDragProps";
  method:
    | "setDragFeatureList"
    | "setLineageFeatureList"
    | "setNoDragFeatureList";
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
