import { expandGlob } from "https://deno.land/std@0.168.0/fs/expand_glob.ts";

import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";

import { displayCyclickPackages } from "./src/analyze.ts";
import { parseSource, type ParseResult } from "./src/parse.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const opts = parse(Deno.args);
  const packageFilter: string | null = opts.f || null;
  const dir = opts._[0];
  const parseResults: ParseResult[] = [];
  for await (const entry of expandGlob(`${dir}/**/*.scala`, {
    globstar: true,
  })) {
    const source = await Deno.readTextFile(entry.path);
    parseResults.push(
      parseSource(source, { packageNameFilter: packageFilter })
    );
  }
  displayCyclickPackages(parseResults);
}
