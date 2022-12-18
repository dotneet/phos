# phos

```bash
# Display mermaid.js flowchart source
deno run --allow-read main.ts mermaid-flowchart -l scala -f 'com.example.(a|b)' '/path/to/src_dir/**/*.scala'

# Detect cyclic depenedencies
deno run --allow-read main.ts detect-cyclic -l scala -f 'com.example.(a|b)' '/path/to/src_dir/**/*.scala'
```
