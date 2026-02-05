import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  schema: "../schema/schema.graphql",
  documents: "src/graphql/**/*.ts",
  generates: {
    "src/graphql/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
      config: {
        scalars: {
          Date: "string",
          DateTime: "string",
          Decimal: "number",
        },
      },
    },
  },
};

export default config;
