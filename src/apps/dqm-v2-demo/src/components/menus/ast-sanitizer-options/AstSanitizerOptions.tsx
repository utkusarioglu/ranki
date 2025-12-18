import { Typography } from "antd";
import { ReorderList } from "../../views/reorder-list/ReorderList";
import { type ItemProps } from "_views/reorder-list/ReorderList.types.mjs";
import { astPropRowBuilder } from "./AstPropRow";
import { useAstViewStore } from "_stores/ast-view/ast-view.store.mjs";
import { useCallback, useMemo } from "react";

export const AstSanitizerOptions = () => {
  const view = useAstViewStore();

  const toggleVisible = useCallback(
    ({ list, index, onChange }: ItemProps<any>) => {
      const newItems = [...list];
      newItems[index] = {
        visible: !newItems[index].visible,
        id: newItems[index].id,
      };
      onChange(newItems);
    },
    [],
  );

  const component = useMemo(() => astPropRowBuilder({ toggleVisible }), []);

  return (
    <div className="padding-inline">
      <Typography.Title level={5}>Node Properties</Typography.Title>
      <ReorderList
        list={view.props}
        onChange={view.setProps}
        id="props"
        enableDrag
        component={component}
      />
      <Typography.Title level={5}>Linage Properties</Typography.Title>
      <ReorderList
        list={view.children}
        onChange={view.setChildren}
        id="children"
        enableDrag
        component={component}
      />
      <Typography.Title level={5}>Stable Properties</Typography.Title>
      <ReorderList
        list={view.stable}
        onChange={view.setStable}
        id="stable"
        enableDrag={false}
        component={component}
      />
    </div>
  );
};
