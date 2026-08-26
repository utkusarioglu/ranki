import type { TryCatch } from "@dqm/package-dqm-v2-debug";

import { TryCatchView } from "_views/try-catch/try-catch";
import { Table, Typography } from "antd";
import { type FC, useMemo } from "react";

export type PropertyTableRows = PropertyTableValueTuple[];

interface PropertyTableProps {
  rows: PropertyTableRows;
}

type PropertyTableValueTuple = [string, TryCatch<any>];

const buildDataSource = (rows: PropertyTableRows) =>
  rows.map(([p, val]) => ({
    key: p.toString().replace(" ", "_").toLowerCase(),
    prop: p,
    val,
  }));

export const PropertyTable: FC<PropertyTableProps> = ({ rows }) => {
  const dataSource = useMemo(() => buildDataSource(rows), [rows]);
  return (
    <Table dataSource={dataSource} pagination={false}>
      <Table.Column dataIndex="prop" key="property" title="Property" />
      <Table.Column
        dataIndex="val"
        key="value"
        render={(val) => (
          <TryCatchView
            Fail={({ item }) => (
              <Typography.Text type="secondary">
                {String(item.value)}
              </Typography.Text>
            )}
            item={val}
            Success={({ item }) => (
              <Typography.Text code>{String(item.value)}</Typography.Text>
            )}
            Undefined={() => (
              <Typography.Text type="secondary">(undefined)</Typography.Text>
            )}
          />
        )}
        title="Value"
      />
    </Table>
  );
};
