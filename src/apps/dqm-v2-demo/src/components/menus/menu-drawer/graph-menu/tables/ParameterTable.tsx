import { useMemo, type FC } from "react";
import { tryCatch } from "../utils";
import { Table, Typography } from "antd";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";

type ParameterTableValueTuple = [string, () => any, () => () => any];

export type ParameterTableRows = ParameterTableValueTuple[];

const buildDataSource = (rows: ParameterTableRows) =>
  rows.map(([p, r, v]) => ({
    key: p.toString().replace(" ", "_").toLowerCase(),
    prop: p,
    raw: tryCatch(r),
    value: tryCatch(v),
  }));

interface ParamTableProps {
  rows: ParameterTableRows;
}

export const ParameterTable: FC<ParamTableProps> = ({ rows }) => {
  const dataSource = useMemo(() => buildDataSource(rows), [rows]);
  return (
    <Table dataSource={dataSource} pagination={false}>
      <Table.Column title="Type" dataIndex="key" key="key" />
      <Table.Column
        title="Raw"
        dataIndex="raw"
        key="raw"
        render={(val) => <Typography.Text code>{val}</Typography.Text>}
      />
      <Table.Column
        title="Value"
        dataIndex="value"
        key="value"
        render={(val) => <YamlDisplay obj={val} padded={false} />}
      />
    </Table>
  );
};
