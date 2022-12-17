export type ParseResult = {
  sourcePackage: string | null;
  imports: ImportStatement[];
};

export type ParseOptions = {
  packageNameFilter: string | null;
};

export type ImportStatement = {
  importObject: string;
  importPackage: string;
};

export function parseSource(
  source: string,
  options: ParseOptions
): ParseResult {
  const packageResult = source.match(/package +([a-zA-Z0-9+.]+)/);
  const sourcePackage: string | null =
    packageResult !== null ? packageResult[1] : null;
  const importStatements: ImportStatement[] = [];
  const imports = source.matchAll(/import +([a-zA-Z0-9+.{}_,* ]+)\n/g);
  for (const importResult of imports) {
    if (
      !options.packageNameFilter ||
      importResult[0].includes(options.packageNameFilter)
    ) {
      const importStatement = importResult[1].trim();
      const r: RegExpMatchArray | null = importStatement.match(
        /([a-z0-9_.]+)\.([A-Z{][a-zA-Z0-9]*)/
      );
      if (r !== null) {
        importStatements.push({
          importPackage: r[1],
          importObject: r[2],
        });
      }
    }
  }
  return {
    sourcePackage,
    imports: importStatements,
  };
}
