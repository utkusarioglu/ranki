import { useMemo, type FC } from "react";
import { tryCatch } from "../utils";
import { Table, Typography } from "antd";

type PropertyTableValueTuple = [string, (...any: any[]) => any];

export type PropertyTableRows = PropertyTableValueTuple[];

interface PropertyTableProps {
  rows: PropertyTableRows;
}

const buildDataSource = (rows: PropertyTableRows) =>
  rows.map(([p, v]) => ({
    key: p.toString().replace(" ", "_").toLowerCase(),
    prop: p,
    val: tryCatch(v),
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
        render={(val) => <Typography.Text code>{val}</Typography.Text>}
      />
    </Table>
  );
};
