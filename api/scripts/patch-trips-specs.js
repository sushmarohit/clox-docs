const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/modules/trips');
const stub = `      {
        notifyTripApproaching: jest.fn().mockResolvedValue({ sentTo: [], results: [] }),
        notifyTripAtDropoff: jest.fn().mockResolvedValue({ sentTo: [], results: [] }),
        notifyPodFinalized: jest.fn().mockResolvedValue({ sentTo: [], results: [] }),
      } as never,`;

for (const name of fs.readdirSync(dir)) {
  if (!name.endsWith('.spec.ts')) continue;
  const file = path.join(dir, name);
  let c = fs.readFileSync(file, 'utf8');
  if (!c.includes('new TripsService') || c.includes('notifyTripApproaching')) {
    console.log('skip', name);
    continue;
  }

  // Insert before the closing of TripsService( ... );
  // Match last "as never," or "as never\n" before `);` that closes TripsService
  c = c.replace(
    /new TripsService\(\s*([\s\S]*?)\n(\s*)\);/g,
    (full, body, indent) => {
      if (body.includes('notifyTripApproaching')) return full;
      const bodyTrim = body.replace(/\s+$/, '');
      // ensure trailing comma on last arg
      const withComma = /as never\s*$/.test(bodyTrim)
        ? bodyTrim.replace(/as never\s*$/, 'as never,')
        : `${bodyTrim},`;
      return `new TripsService(\n${withComma}\n${stub}\n${indent});`;
    },
  );

  fs.writeFileSync(file, c);
  console.log('ok', name);
}
