import yaml from "yaml";
import { useEffect } from "react";
import { useDqmStore } from "../../../stores/dqm/dqm.store.mts";
import {
  SINGLE_TEMPLATES_FILES,
  ARRANGEMENT_TEMPLATES_FILES,
  SINGLE_TEMPLATES_RELPATH,
  ARRANGEMENT_TEMPLATES_RELPATH,
} from "./templates.constants.mts";
import type { SingleTemplateGroup } from "./single-template/SingleTemplate.types.mts";
import type { ArrangementTemplateGroup } from "./arrangement-template/ArrangementTemplate.types.mts";

export function useSingleTemplateFetch() {
  const code = useDqmStore();
  useEffect(() => {
    if (!code.singleTemplates.length) {
      multiFetch<SingleTemplateGroup>(
        SINGLE_TEMPLATES_RELPATH,
        SINGLE_TEMPLATES_FILES,
      ).then((t) => code.setSingleTemplates(t));
    }
  }, []);
}

export function useArrangementTemplateFetch() {
  const code = useDqmStore();
  useEffect(() => {
    if (!code.arrangementTemplates.length) {
      multiFetch<ArrangementTemplateGroup>(
        ARRANGEMENT_TEMPLATES_RELPATH,
        ARRANGEMENT_TEMPLATES_FILES,
      ).then((t) => code.setArrangementTemplates(t));
    }
  }, []);
}

async function multiFetch<T>(
  relpath: string,
  baseNames: string[],
): Promise<T[]> {
  const filenames = baseNames.map((v) => [relpath, v].join("/"));
  if (!baseNames.length) {
    throw new Error("EMPTY_ARRAY");
  }
  return Promise.all(filenames.map((filename) => fetchYaml(filename)));
}

async function fetchYaml(filename: string) {
  return fetch(filename)
    .then((d) => d.text())
    .then((t) => yaml.parse(t));
}
