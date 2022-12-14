import { createdAtColumn, idColumn, Template } from "@shared/lib/dialects/template";

export const BasicTable: Template = new Template({
  name: "数据表",
  description: "A table",
  tableName: "untitled_table",
  schemaName: "public"
}, [
  idColumn,
  createdAtColumn,
])