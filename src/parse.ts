export type ParseResult = {
  sourceModule: string | null;
  imports: ModuleRefernce[];
};

export type ParseOptions = {
  moduleNameFilter: string | null;
};

export type ModuleRefernce = {
  object: string;
  module: string;
};

export type Strategy = {
  extractSourceModule: (source: string, options: ParseOptions) => string | null;
  extractModuleReferences: (
    source: string,
    options: ParseOptions
  ) => ModuleRefernce[];
};

export function parseSource(
  strategy: Strategy,
  source: string,
  options: ParseOptions
): ParseResult {
  const sourceModule: string | null = strategy.extractSourceModule(
    source,
    options
  );
  const importStatements: ModuleRefernce[] = strategy.extractModuleReferences(
    source,
    options
  );
  return {
    sourceModule,
    imports: importStatements,
  };
}
