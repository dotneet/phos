import { parse } from "https://deno.land/std@0.168.0/flags/mod.ts";

import { displayCyclickPackages, toMermaidFlowchart } from "./src/analyze.ts";
import { parseSources } from "./src/parse.ts";

if (import.meta.main) {
  const opts = parse(Deno.args);

  const lang = opts.l || "scala";
  const globPattern = opts._[1] as string;
  const moduleFilter: string | null = opts.f || null;
  const parseResults = await parseSources(lang, globPattern, moduleFilter);

  const subcommand = opts._[0];
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
