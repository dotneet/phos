import { ModuleRefernce, ParseOptions, Strategy } from "../parse.ts";

export const scalaParseStrategy: Strategy = {
  extractSourceModule: (source) => {
    const matchResult = source.match(/package +([a-zA-Z0-9+.]+)/);
    return matchResult !== null ? matchResult[1] : null;
  },
  extractModuleReferences: (source: string, options: ParseOptions) => {
    const importStatements: ModuleRefernce[] = [];
    const imports = source.matchAll(/import +([a-zA-Z0-9+.{}_,* ]+)\n/g);
    for (const importResult of imports) {
      if (
        !options.moduleNameFilter ||
        importResult[0].includes(options.moduleNameFilter)
      ) {
        const importStatement = importResult[1].trim();
        const r: RegExpMatchArray | null = importStatement.match(
          /([a-z0-9_.]+)\.([A-Z{][a-zA-Z0-9]*)/
        );
        if (r !== null) {
          importStatements.push({
            module: r[1],
            object: r[2],
          });
        }
      }
    }
    return importStatements;
  },
};
