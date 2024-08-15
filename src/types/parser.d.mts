export type Tags = string[];

export type Params = string[];

export interface ParserPartFlavorPlainWoContent {
  flavor: "plain";
  part: string;
  // content: string;
}

export interface ParserPartFlavorPlain extends ParserPartFlavorPlainWoContent {
  // flavor: "plain";
  // part: string;
  content: string;
}

export interface ParserPartFlavorFrameWoContent {
  flavor: "frame";
  part: string;
}

export interface ParserPartFlavorFrame extends ParserPartFlavorFrameWoContent {
  content: {
    tags: string[];
    params: string[];
    isComplete: boolean;
    lines: string[];
  };
}

export type ParserPart = ParserPartFlavorPlain | ParserPartFlavorFrame;
export type ParserPartWoContent =
  | ParserPartFlavorPlainWoContent
  | ParserPartFlavorFrameWoContent;

export interface ContentCommon {
  raw: string;
  parts: ParserPart[];
}

interface ContentCommonWithTags extends ContentCommon {
  tags: Tags;
}

export interface ParagraphContent extends ContentCommon {
  params: {
    isCentered: boolean;
  };
}

export interface HeadingContent extends ContentCommon {
  params: {
    level: number;
    isCentered: boolean;
  };
}

export interface ParserKindParagraphCommon {
  type: "text";
  kind: "paragraph";
}

export interface ParserKindParagraph extends ParserKindParagraphCommon {
  content: ParagraphContent[];
}

export interface ParserKindHeadingCommon {
  type: "text";
  kind: "heading";
}

export interface ParserKindHeading extends ParserKindHeadingCommon {
  content: HeadingContent[];
}

export interface TableHeaderOrData {
  tag: Tags;
  raw: string;
  parts: ParserPart[];
}

export interface ParserKindFrameTableContent {
  head: TableHeaderOrData[][];
  body: TableHeaderOrData[][];
  foot: TableHeaderOrData[][];
}

export interface ParserKindFrameTable extends ParserGroupFrameCommon {
  kind: "table";
  content: ParserKindFrameTableContent;
}

export interface ListItemLine {
  raw: string;
  parts: ParserPart[];
}

export interface ParserKindFrameListContent {
  tag: Tags;
  lines: ListItemLine[];
}

export interface ParserKindFrameList extends ParserGroupFrameCommon {
  kind: "ul" | "ol";
  content: ParserKindFrameListContent[];
}

export interface ParserGroupFrameCommon {
  type: "frame";
  tags: Tags;
  params: Params;
  isComplete: boolean;
  lines: string[];
}

// export interface DlItemTitle {
//   raw: string;
//   tags: Tags; // tags instead of tag
//   parts: ParserPart[];
// }

export interface ParserKindFrameDlContent {
  title: ContentCommonWithTags[];
  lines: ContentCommonWithTags[];
}

export interface ParserKindFrameDl extends ParserGroupFrameCommon {
  kind: "dl";
  content: ParserKindFrameDlContent[];
}

export interface ParserKindFrameCode extends ParserGroupFrameCommon {
  kind: "code";
  content: string[];
}

export interface ParserKindFramePreCode extends ParserGroupFrameCommon {
  kind: "pre code";
  content: string[];
}

export interface ParserKindFramePre extends ParserGroupFrameCommon {
  kind: "pre";
  content: string[];
}

interface ParserGroupCommon {
  lines: string[];
}

interface ParserGroupDiscarded extends ParserGroupCommon {
  type: "empty" | "comment";
}

interface ParserGroupText extends ParserGroupCommon {
  type: "text";
}

interface ParserGroupFrame extends ParserGroupCommon {
  type: "frame";
  tags: Tags;
  params: Params;
  isComplete: boolean;
}

export type ParserKindText = ParserKindParagraph | ParserKindHeading;

export type ParserKindFrame =
  | ParserKindFrameCode
  | ParserKindFramePreCode
  | ParserKindFramePre
  | ParserKindFrameTable
  | ParserKindFrameList
  | ParserKindFrameDl;

export type ParserKind = ParserKindText | ParserKindFrame;

export type ParserGroup =
  | ParserGroupDiscarded
  | ParserGroupText
  | ParserGroupFrame;

export interface ParserField {
  field: string;
  list: ParserKind[];
}

export type Stack = Tags;

export interface ParserKindParagraphWoParts extends ParserKindParagraphCommon {
  content: Omit<ParagraphContent, "parts">[];
}
export interface ParserKindHeadingWoParts extends ParserKindHeadingCommon {
  content: Omit<HeadingContent, "parts">[];
}

export type ParserKindTextWoParts =
  | ParserKindParagraphWoParts
  | ParserKindHeadingWoParts;

export type ParseFieldLineParams1 = {
  stack: Stack;
  groups: ParserGroup[];
};

export type ContentCommonWoParts = Omit<ContentCommon, "parts">;

interface TablePartWoParts {
  defaultTag: "th" | "td";
  tags: Tags[][];
  values: ContentCommonWoParts[][];
}

interface TablePart {
  defaultTag: "th" | "td";
  tags: Tags[][];
  values: ContentCommon[][];
}

export interface TableParts {
  head: TablePartWoParts;
  body: TablePartWoParts;
  foot: TablePartWoParts;
}

export interface TableComplete {
  head: TablePart;
  body: TablePart;
  foot: TablePart;
}

export interface DlItemRawOnly {
  title: ContentCommonWoParts[];
  lines: ContentCommonWoParts[];
}

export interface DlItemWithParts {
  title: ContentCommon[];
  lines: ContentCommon[];
}

export interface DlItemWithTags {
  title: ContentCommonWithTags[];
  lines: ContentCommonWithTags[];
}

export interface ListItemsRaw {
  lines: ContentCommonWoParts[];
}

export interface ListItemsComplete {
  lines: ContentCommon[];
}