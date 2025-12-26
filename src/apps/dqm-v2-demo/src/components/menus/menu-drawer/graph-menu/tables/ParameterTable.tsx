import { useMemo, type FC } from "react";
import { Table, Typography } from "antd";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import type { TryCatch } from "_utils/utils.mjs";
import { TryCatchView } from "_views/try-catch/try-catch";
import { DqmDemoError } from "_error";

export type ParameterTableValueTuple = [string, TryCatch<any>];

export type ParameterTableRows = ParameterTableValueTuple[];

const buildDataSource = (rows: ParameterTableRows) => {
  try {
    return rows.map(([p, value]) => ({
      key: p.toString().replace(" ", "_").toLowerCase(),
      prop: p,
      value,
    }));
  } catch (e) {
    throw new DqmDemoError({
      code: "DATA_BUILD_FAIL",
      why: "build data source method failed unexpectedly",
      cause: e,
      details: {
        rows,
      },
    });
  }
};

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
        dataIndex="value"
        key="raw"
        render={(val) => <Typography.Text code>{val.value}</Typography.Text>}
      />
      <Table.Column
        title="Value"
        dataIndex="value"
        key="value"
        render={(item) => (
          <TryCatchView
            item={item}
            Undefined={() => (
              <Typography.Text type="secondary">(undefined)</Typography.Text>
            )}
            Fail={({ item }) => (
              <Typography.Text type="secondary">
                {String(item.value)}
              </Typography.Text>
            )}
            Success={({ item }) => (
              <YamlDisplay
                // @ts-ignore
                obj={item.value}
                padded={false}
              />
            )}
          />
        )}
      />
    </Table>
  );
};
