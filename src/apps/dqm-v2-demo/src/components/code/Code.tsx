import { CodeHighlight } from "@mantine/code-highlight";
import type { FC } from "react";
import {
  CodeHighlightAdapterProvider,
  createHighlightJsAdapter,
} from "@mantine/code-highlight";
import hljs from "highlight.js/lib/core";
import yamlLang from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("yaml", yamlLang);

const highlightJsAdapter = createHighlightJsAdapter(hljs);

interface CodeViewProps {
  code: string;
}

export const CodeView: FC<CodeViewProps> = ({ code }) => {
  return (
    <CodeHighlightAdapterProvider adapter={highlightJsAdapter}>
      <CodeHighlight code={code} language="yml" radius="md" />
    </CodeHighlightAdapterProvider>
  );
};
