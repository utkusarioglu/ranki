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
          const lowercase = alias.toLowerCase();
          if (assignments.has(lowercase)) {
            throw new Error(`Code alias ${lowercase} assigned twice`);
          }
          assignments.set(lowercase, {
            hljsName,
            displayName,
          });
        });
      },
    );
    return assignments;
  }

  codeAlias(alias: string): CodeAliasReturn {
    const lowercase = alias.toLowerCase();
    const assigned = this.assignments.get(lowercase);
    if (assigned) {
      return {
        ...assigned,
        found: true,
      };
    }

    return {
      hljsName: lowercase,
      displayName: lowercase.slice(0, 1).toUpperCase() + alias.slice(1),
      found: false,
    };
  }

  /**
   * Use this to compute the hash for the rendered content
   */
  computeHash(str: string, seed = 0) {
    let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
  }
}
