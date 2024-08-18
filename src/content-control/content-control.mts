import type { RankiAliases } from "../config/config.d.mjs";

interface ContentControlCodeAssignment {
  hljsName: string;
  displayName: string;
}

interface CodeAliasReturn extends ContentControlCodeAssignment {
  found: boolean;
}

type AssignmentsMap = Map<string, ContentControlCodeAssignment>;

export class ContentControl {
  private assignments: AssignmentsMap;

  constructor(aliases: RankiAliases) {
    this.assignments = this._computeAssignments(aliases);
  }

  private _computeAssignments(aliases: RankiAliases): AssignmentsMap {
    const assignments = new Map();
    Object.entries(aliases.code).forEach(
      ([hljsName, { list, displayName }]) => {
        list.forEach((alias) => {
          if (assignments.has(alias)) {
            throw new Error(`Code alias ${alias} assigned twice`);
          }
          assignments.set(alias, {
            hljsName,
            displayName,
          });
        });
      },
    );
    return assignments;
  }

  codeAlias(alias: string): CodeAliasReturn {
    const assigned = this.assignments.get(alias);
    if (assigned) {
      return {
        ...assigned,
        found: true,
      };
    }

    return {
      hljsName: alias.toLowerCase(),
      displayName:
        alias.slice(0, 1).toUpperCase() + alias.slice(1).toLowerCase(),
      found: false,
    };
  }
}
