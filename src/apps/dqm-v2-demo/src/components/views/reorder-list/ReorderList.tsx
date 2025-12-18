import { useRef, type FC } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type {
  DraggableRowProps,
  EditableReorderListProps,
} from "./ReorderList.types.mts";

export const ReorderList: FC<EditableReorderListProps> = ({
  id,
  list,
  enableDrag,
  component,
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
          onChange={onChange}
          list={list}
          key={i}
          type={id}
          enableDrag={enableDrag}
          id={item.id}
          index={i}
          item={item}
          move={move}
          component={component}
        />
      ))}
    </DndProvider>
  );
};

const DraggableRow: FC<DraggableRowProps> = ({
  type,
  id,
  index,
  move,
  item,
  list,
  enableDrag,
  onChange,
  component: Component,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type,
    item: () => ({ id, index }),
    canDrag: () => enableDrag,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
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

  // drag(drop(ref));

  return (
    <Component
      ref={(node) => {
        ref.current = node;
        if (node) drag(drop(node));
      }}
      enableDrag={enableDrag}
      isDragging={isDragging}
      item={item}
      list={list}
      onChange={onChange}
      index={index}
    />
  );
};
