import { expandGlob } from "https://deno.land/std@0.168.0/fs/expand_glob.ts";
import { scalaParseStrategy } from "./lang/scala.ts";

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

export async function parseSources(
  lang: string,
  globPattern: string,
  moduleFilter: string | null
) {
  const parseResults: ParseResult[] = [];
  for await (const entry of expandGlob(globPattern, {
    globstar: true,
  })) {
    let strategy: Strategy = scalaParseStrategy;
    if (lang === "scala") {
      strategy = scalaParseStrategy;
    } else {
      throw new Error(`Not supported: ${lang}`);
    }
    const source = await Deno.readTextFile(entry.path);
    const parseResult = parseSource(strategy, source, {
      moduleNameFilter: moduleFilter,
    });
    if (!moduleFilter || parseResult.sourceModule?.match(moduleFilter)) {
      parseResults.push(parseResult);
    }
  }
  return parseResults;
}

function parseSource(
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
