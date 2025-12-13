import type {
  IAstNodeRelationship,
  IAstNodeNature,
  IAstNodeKind,
  ContentDirection,
  CreationMethod,
} from "@dqm/package-dqm-api-v2";
import { assertExists } from "@dqm/package-utils";

export function semanticCapability<T>(self: T) {
  let meaning!: string;
  let relationship!: IAstNodeRelationship;
  let nature: IAstNodeNature = "literal";
  let kind: IAstNodeKind = "leaf";
  let creationMethod!: string;
  let direction!: ContentDirection;

  return {
    setKind(k: IAstNodeKind): T {
      kind = k;
      return self;
    },

    getKind(): IAstNodeKind {
      assertExists(kind, { why: "Kind needs to be predefined" });
      return kind;
    },

    setCreationMethod(m: string): T {
      creationMethod = m;
      return self;
    },

    getCreationMethod(): CreationMethod {
      return creationMethod;
    },

    setRelationship(r: IAstNodeRelationship): T {
      relationship = r;
      return self;
    },

    getRelationship(): IAstNodeRelationship {
      return relationship;
    },

    setNature(n: IAstNodeNature): T {
      nature = n;
      return self;
    },

    getNature(): IAstNodeNature {
      return nature;
    },

    getDirection(): ContentDirection {
      assertExists(direction, { why: "Direction needs to be predefined" });
      return direction;
    },

    setMeaning(m: string): T {
      meaning = m;
      return self;
    },

    getMeaning(): string {
      assertExists(meaning, { why: "Meaning needs to be predefined" });
      return meaning;
    },

    setDirection(d: ContentDirection): T {
      direction = d;
      return self;
    },
  };
}
