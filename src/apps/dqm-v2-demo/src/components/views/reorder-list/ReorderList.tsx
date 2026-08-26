import { type FC, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import type {
  DraggableRowProps,
  EditableReorderListProps,
} from "./ReorderList.types.mts";

export const ReorderList: FC<EditableReorderListProps> = ({
  component,
  enableDrag,
  id,
  list,
  onChange,
}) => {
  const move = (from: number, to: number) => {
    const newItems = [...list];
    const [removed] = newItems.splice(from, 1);
    newItems.splice(to, 0, removed);
    onChange(newItems);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      {list.map((item, i) => (
        <DraggableRow
          component={component}
          enableDrag={enableDrag}
          id={item.id}
          index={i}
          item={item}
          key={i}
          list={list}
          move={move}
          onChange={onChange}
          type={id}
        />
      ))}
    </DndProvider>
  );
};

const DraggableRow: FC<DraggableRowProps> = ({
  component: Component,
  enableDrag,
  id,
  index,
  item,
  list,
  move,
  onChange,
  type,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    canDrag: () => enableDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => ({ id, index }),
    type,
  });

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

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      move(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  return (
    <Component
      enableDrag={enableDrag}
      index={index}
      isDragging={isDragging}
      item={item}
      list={list}
      onChange={onChange}
      ref={(node) => {
        ref.current = node;
        if (node) drag(drop(node));
      }}
    />
  );
};
