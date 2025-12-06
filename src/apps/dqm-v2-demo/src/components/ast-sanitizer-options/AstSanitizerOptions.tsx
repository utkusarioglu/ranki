import { Typography } from "antd";
import { ReorderList } from "../reorder-list/ReorderList";

export const AstSanitizerOptions = () => {
  return (
    <div className="padding-inline">
      <Typography.Title level={5}>Node Properties</Typography.Title>
      <ReorderList
        list="astDragProps"
        method="setDragFeatureList"
        allowDragging
      />
      <Typography.Title level={5}>Linage Properties</Typography.Title>
      <ReorderList
        list="astLineageProps"
        method="setLineageFeatureList"
        allowDragging
      />
      <Typography.Title level={5}>Linage Properties</Typography.Title>
      <ReorderList
        list="astNoDragProps"
        method="setNoDragFeatureList"
        allowDragging={false}
      />
    </div>
  );
};
