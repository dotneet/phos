import { Sha1 } from "https://deno.land/std@0.140.0/hash/sha1.ts";
import {
  Graph,
  tsort,
  Vertex,
  Edge,
  TSortResult,
} from "npm:@devneko/graph-ts@0.1.2";
import { ParseResult } from "./parse.ts";

export type PackageDependency = {
  from: string;
  to: string;
};

export type AnalyzeResult = {
  packageDependencies: PackageDependency;
};

function toMermaidNotation(packageName: string): string {
  // Use a hash in case the package name contains a reserved word.
  const hash = new Sha1().update(packageName).hex().slice(0, 8);
  return `${hash}(${packageName})`;
}

export function displayCyclickPackages(parseResults: ParseResult[]): void {
  const graph = new Graph();
  const items: Map<string, { inV: Vertex; outV: Vertex }> = new Map();
  const vertexMap: Map<string, Vertex> = new Map();
  for (const r of parseResults) {
    if (r.sourcePackage !== null) {
      if (!vertexMap.has(r.sourcePackage)) {
        const v = graph.createVertex("package", {
          name: r.sourcePackage,
        });
        vertexMap.set(r.sourcePackage, v);
      }
      for (const i of r.imports) {
        if (!vertexMap.has(i.importPackage)) {
          const v = graph.createVertex("package", {
            name: i.importPackage,
          });
          vertexMap.set(i.importPackage, v);
        }
        const inV = vertexMap.get(r.sourcePackage)!;
        const outV = vertexMap.get(i.importPackage)!;
        items.set(inV.id + "-" + outV.id, { inV: inV, outV: outV });
      }
    }
  }
  for (const item of items) {
    graph.createEdge(item[1].inV, item[1].outV);
  }
  const r: TSortResult = tsort(graph);
  r.restEdges.forEach((e: Edge) => {
    const i = e.inVertex.props.get("name");
    const o = e.outVertex.props.get("name");
    console.log(`${i} ==> ${o}`);
  });
}
