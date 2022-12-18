import { Sha1 } from "https://deno.land/std@0.140.0/hash/sha1.ts";
import {
  Edge,
  Graph,
  tsort,
  TSortResult,
  Vertex,
  decomposeSCC,
} from "npm:@devneko/graph-ts@0.1.6";
import { ParseResult } from "./parse.ts";

export type PackageDependency = {
  from: string;
  to: string;
};

export type AnalyzeResult = {
  packageDependencies: PackageDependency;
};

export function displayCyclickPackages(parseResults: ParseResult[]): void {
  const graph = new Graph();
  const items: Map<string, { from: Vertex; to: Vertex }> = new Map();
  const vertexMap: Map<string, Vertex> = new Map();
  for (const r of parseResults) {
    if (r.sourceModule !== null) {
      if (!vertexMap.has(r.sourceModule)) {
        const v = graph.addVertex("package", {
          name: r.sourceModule,
        });
        vertexMap.set(r.sourceModule, v);
      }
      for (const i of r.imports) {
        if (!vertexMap.has(i.module)) {
          const v = graph.addVertex("package", {
            name: i.module,
          });
          vertexMap.set(i.module, v);
        }
        const inV = vertexMap.get(r.sourceModule)!;
        const outV = vertexMap.get(i.module)!;
        items.set(inV.props.get("name") + " ==> " + outV.props.get("name"), {
          from: inV,
          to: outV,
        });
      }
    }
  }
  for (const item of items) {
    graph.addEdge("refer", item[1].from, item[1].to);
  }
  const sccs = decomposeSCC(graph);
  for (const scc of sccs) {
    if (scc.length > 1) {
      console.log("cyclic modules:");
      for (const c of scc) {
        console.log(c.props.get("name"));
      }
      console.log("");
    }
  }
}

function toMermaidNotation(packageName: string): string {
  // Use a hash in case the package name contains a reserved word.
  const hash = new Sha1().update(packageName).hex().slice(0, 8);
  return `${hash}(${packageName})`;
}

export function toMermaidFlowchart(parseResults: ParseResult[]): string {
  const dependencySet: Set<string> = new Set();
  for (const r of parseResults) {
    if (r.sourceModule) {
      for (const module of r.imports) {
        dependencySet.add(
          `${toMermaidNotation(r.sourceModule)} --> ${toMermaidNotation(
            module.module
          )}`
        );
      }
    }
  }

  let mermaid = "flowchart LR\n";
  for (const dependency of dependencySet) {
    mermaid += `    ${dependency}\n`;
  }
  return mermaid;
}
