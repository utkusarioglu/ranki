import { useAstViewStore } from "_stores/ast-view/ast-view.store.mjs";
import { type ItemProps } from "_views/reorder-list/ReorderList.types.mjs";
import { Typography } from "antd";
import { useCallback, useMemo } from "react";

import { ReorderList } from "../../views/reorder-list/ReorderList";
import { astPropRowBuilder } from "./AstPropRow";

export const AstSanitizerOptions = () => {
  const view = useAstViewStore();

  const toggleVisible = useCallback(
    ({ index, list, onChange }: ItemProps<any>) => {
      const newItems = [...list];
      newItems[index] = {
        id: newItems[index].id,
        visible: !newItems[index].visible,
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
        component={component}
        enableDrag
        id="props"
        list={view.props}
        onChange={view.setProps}
      />
      <Typography.Title level={5}>Linage Properties</Typography.Title>
      <ReorderList
        component={component}
        enableDrag
        id="children"
        list={view.children}
        onChange={view.setChildren}
      />
      <Typography.Title level={5}>Stable Properties</Typography.Title>
      <ReorderList
        component={component}
        enableDrag={false}
        id="stable"
        list={view.stable}
        onChange={view.setStable}
      />
    </div>
  );
};
