export type PQColumnType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "datetimezone"
  | "time"
  | "duration"
  | "logical"
  | "any";

export interface PQColumnDef {
  name: string;
  type: PQColumnType;
}

export interface PQTableData {
  columns: PQColumnDef[];
  rows: Record<string, unknown>[];
}

export interface SampleTable {
  id: string;
  displayName: string;
  description: string;
  data: PQTableData;
}

export interface FunctionParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export interface Compatibility {
  pbiDesktop: boolean;
  pbiService: boolean;
  excelDesktop: boolean;
  excelOnline: boolean;
  dataflows: boolean;
  fabricNotebooks: boolean;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
}

export interface FunctionFrontmatter {
  title: string;
  slug: string;
  category: string;
  description: string;
  syntax: string;
  returnType: string;
  returnDescription: string;
  parameters: FunctionParam[];
  compatibility: Compatibility;
  relatedFunctions: string[];
}

export interface FunctionIndexEntry {
  title: string;
  slug: string;
  category: string;
  description: string;
}

export interface ConceptFrontmatter {
  title: string;
  slug: string;
  description: string;
  relatedConcepts: string[];
  relatedFunctions: string[];
}

export interface ConceptIndexEntry {
  title: string;
  slug: string;
  description: string;
}
