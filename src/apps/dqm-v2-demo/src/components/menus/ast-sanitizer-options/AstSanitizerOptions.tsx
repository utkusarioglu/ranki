import { Typography } from "antd";
import { ReorderList } from "../../reorder-list/ReorderList";

export const AstSanitizerOptions = () => {
  return (
    <div className="padding-inline">
      <Typography.Title level={5}>Node Properties</Typography.Title>
      <ReorderList list="props" method="setProps" allowDragging />
      <Typography.Title level={5}>Linage Properties</Typography.Title>
      <ReorderList list="children" method="setChildren" allowDragging />
      <Typography.Title level={5}>Stable Properties</Typography.Title>
      <ReorderList list="stable" method="setStable" allowDragging={false} />
    </div>
  );
};
