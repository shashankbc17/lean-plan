import fs from 'fs';
import path from 'path';

function searchDir(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) searchDir(full);
    else if (full.endsWith('.ts') || full.endsWith('.js')) {
      const code = fs.readFileSync(full, 'utf8');
      code.split('\n').forEach((line, idx) => {
        if (line.includes('name:') && line.includes('Agent')) {
          console.log(full, idx + 1, line);
        }
      });
    }
  }
}
searchDir('C:/Users/Shashank/flow-mcp/src');
searchDir('C:/Users/Shashank/flow-mcp/dist');
