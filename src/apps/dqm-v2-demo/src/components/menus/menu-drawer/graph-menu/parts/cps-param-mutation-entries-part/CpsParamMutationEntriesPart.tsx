import { type FC, type ReactNode } from "react";
import { SectionTitle } from "../../section-title/SectionTitle";
import type { ICpsParam } from "@dqm/package-dqm-api-v2";
import type { ClassSanitizer } from "@dqm/package-dqm-v2-debug";
import { TryCatchSourceCard } from "_views/try-catch-source-card/TryCatchSourceCard";
import { Typography } from "antd";
import { ExceptionCard } from "_views/exception-card/ExceptionCard";

interface CpsParamMutationEntriesPartProps {
  param: ClassSanitizer<ICpsParam>;
}

export const CpsParamMutationEntriesPart: FC<
  CpsParamMutationEntriesPartProps
> = ({ param: c }) => {
  const astCoupled = c.isCoupled();
  let content: ReactNode;
  if (astCoupled.state === "fail") {
    content = (
      <ExceptionCard>
        <Typography>
          Retrieval of
          <Typography.Text code>AstParam</Typography.Text>
          coupling state failed unexpectedly
        </Typography>
      </ExceptionCard>
    );
  }

  if (astCoupled.value === false) {
    content = (
      <ExceptionCard>
        This <Typography.Text code>CpsParam</Typography.Text>
        is not coupled with any <Typography.Text code>AstParam</Typography.Text>
        .
      </ExceptionCard>
    );
  } else {
    content = (
      <TryCatchSourceCard
        topDescription={
          <>
            <p>
              <Typography.Text>
                These are sent to Customization library to merge with the
                component config.
              </Typography.Text>
            </p>
            <p>
              <Typography.Text>
                Note that <Typography.Text code>channel</Typography.Text> is
                included in <Typography.Text code>value</Typography.Text> in
                this presentation. During consumption{" "}
                <Typography.Text code>channel</Typography.Text> is omitted for{" "}
                <Typography.Text code>DqmConfig</Typography.Text>.
              </Typography.Text>
            </p>
          </>
        }
        item={c.getMutationEntries(true)}
      />
    );
  }

  return (
    <>
      <SectionTitle>Mutation entries</SectionTitle>
      {content}
    </>
  );
};
