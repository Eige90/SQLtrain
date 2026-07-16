export type ReferentialAction =
  | "NO ACTION"
  | "RESTRICT"
  | "SET NULL"
  | "SET DEFAULT"
  | "CASCADE";

export type ColumnAffinity =
  | "INTEGER"
  | "TEXT"
  | "BLOB"
  | "REAL"
  | "NUMERIC";

export type DatabaseRelationship = {
  id: string;
  childTable: string;
  childColumn: string;
  parentTable: string;
  parentColumn: string;
  onUpdate: ReferentialAction;
  onDelete: ReferentialAction;
  match: string;
};

export type RelationshipInput = {
  parentTable: string;
  parentColumn: string;
  childTable: string;
  childColumn: string;
  onUpdate: ReferentialAction;
  onDelete: ReferentialAction;
};

export type RelationshipValidationResult = {
  valid: boolean;
  existing: boolean;
  parentNullCount: number;
  parentDuplicateCount: number;
  orphanCount: number;
  parentAffinity: ColumnAffinity;
  childAffinity: ColumnAffinity;
  problems: string[];
};

export type CreateRelationshipResult = {
  created: true;
  relationship: DatabaseRelationship;
  validation: RelationshipValidationResult;
};
