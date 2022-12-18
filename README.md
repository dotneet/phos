# phos

```bash
# Display mermaid.js flowchart source
deno run --allow-read main.ts mermaid-flowchart -l scala -f com.example /path/to/source_dir

# Detect cyclic depenedencies
deno run --allow-read main.ts detect-cyclic -l scala -f com.example /path/to/source_dir
```
