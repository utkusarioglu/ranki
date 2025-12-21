import { useMemo, type FC } from "react";
import { tryCatch, type Rows } from "../utils";
import { Table, Typography } from "antd";

const buildDataSource = (rows: Rows) =>
  rows.map(([p, v]) => ({
    key: p.toString().replace(" ", "_").toLowerCase(),
    prop: p,
    val: tryCatch(v),
  }));

interface ParamTableProps {
  rows: Rows;
}

export const ParamTable: FC<ParamTableProps> = ({ rows }) => {
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
