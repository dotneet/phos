import { expandGlob } from "https://deno.land/std@0.168.0/fs/expand_glob.ts";

import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";

import { displayCyclickPackages, toMermaidFlowchart } from "./src/analyze.ts";
import { scalaParseStrategy } from "./src/lang/scala.ts";
import { parseSource, type ParseResult } from "./src/parse.ts";

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const opts = parse(Deno.args);
  const lang = opts.l || "scala";
  const moduleFilter: string | null = opts.f || null;
  const subcommand = opts._[0];
  const dir = opts._[1];
  const parseResults: ParseResult[] = [];
  for await (const entry of expandGlob(`${dir}/**/*.scala`, {
    globstar: true,
  })) {
    const source = await Deno.readTextFile(entry.path);
    parseResults.push(
      parseSource(scalaParseStrategy, source, {
        moduleNameFilter: moduleFilter,
      })
    );
  }
  switch (subcommand) {
    case "detect-cyclic":
      displayCyclickPackages(parseResults);
      break;
    case "mermaid-flowchart": {
      const mermaid = toMermaidFlowchart(parseResults);
      console.log(mermaid);
      break;
    }
    default:
      console.error(`unknown subcommand: ${subcommand}`);
  }
}
