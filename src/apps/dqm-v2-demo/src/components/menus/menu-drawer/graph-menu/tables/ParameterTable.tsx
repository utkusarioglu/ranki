import type { TryCatch } from "@dqm/package-dqm-v2-debug";

import { DqmDemoError } from "_error";
import { TryCatchView } from "_views/try-catch/try-catch";
import { YamlDisplay } from "_views/yaml-display/YamlDisplay";
import { Table, Typography } from "antd";
import { type FC, useMemo } from "react";

export type ParameterTableValueTuple = [string, TryCatch<any>];

type ParameterTableRows = ParameterTableValueTuple[];

const buildDataSource = (rows: ParameterTableRows) => {
  try {
    return rows.map(([p, value]) => ({
      key: p.toString().replace(" ", "_").toLowerCase(),
      prop: p,
      value,
    }));
  } catch (e) {
    throw new DqmDemoError({
      cause: e,
      code: "DATA_BUILD_FAIL",
      details: {
        rows,
      },
      why: "build data source method failed unexpectedly",
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
      <Table.Column dataIndex="key" key="key" title="Type" />
      <Table.Column
        dataIndex="value"
        key="raw"
        render={(val) => <Typography.Text code>{val.value}</Typography.Text>}
        title="Raw"
      />
      <Table.Column
        dataIndex="value"
        key="value"
        render={(item) => (
          <TryCatchView
            Fail={({ item }) => (
              <Typography.Text type="secondary">
                {String(item.value)}
              </Typography.Text>
            )}
            item={item}
            Success={({ item }) => (
              <YamlDisplay
                // @ts-ignore
                obj={item.value}
                padded={false}
              />
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
