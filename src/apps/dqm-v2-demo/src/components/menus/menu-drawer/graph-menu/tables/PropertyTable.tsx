import { useMemo, type FC } from "react";
import { Table, Typography } from "antd";
import type { TryCatch } from "@dqm/package-dqm-v2-debug";
import { TryCatchView } from "_views/try-catch/try-catch";

type PropertyTableValueTuple = [string, TryCatch<any>];

export type PropertyTableRows = PropertyTableValueTuple[];

interface PropertyTableProps {
  rows: PropertyTableRows;
}

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
      <Table.Column title="Property" dataIndex="prop" key="property" />
      <Table.Column
        title="Value"
        dataIndex="val"
        key="value"
        render={(val) => (
          <TryCatchView
            item={val}
            Undefined={() => (
              <Typography.Text type="secondary">(undefined)</Typography.Text>
            )}
            Fail={({ item }) => (
              <Typography.Text type="secondary">
                {String(item.value)}
              </Typography.Text>
            )}
            Success={({ item }) => (
              <Typography.Text code>{String(item.value)}</Typography.Text>
            )}
          />
        )}
      />
    </Table>
  );
};
