import fs from 'fs';

/* eslint-disable no-console */
/**
 * @desc Script to automatically switch prisma database provider from
 * postgresql (for vercel deployment environment) to sqlite (for local
 * development).
 */

const VERCEL_URL = process.env.VERCEL_URL;
const isVercel = process.argv.length > 2 ? process.argv[2] === 'vercel' : !!VERCEL_URL;

console.log('prisma-switch: VERCEL_URL:', VERCEL_URL);
console.log('prisma-switch: isVercel:', isVercel);

const prismaFile = 'prisma/schema.prisma';

/** Replace provider for required in the current environment: postgresql is only for vercel */
const requiredProvider = 'postgresql'; // isVercel ? 'postgresql' : 'sqlite';
const requiredTarget = isVercel ? 'rhel-openssl-3.0.x' : 'windows';
// TODO: Provider also should depend on a local `DATABASE_URL` environment parameter.<F2>

const providerRegex = /^(\s*provider\s*=\s*")(sqlite|postgresql)(")/m;
const targetsRegex = /^(\s*binaryTargets\s*=\s*\[")(.*)("\].*)$/m;

/* // Workaround for a vercel error:
 * Unhandled Rejection: PrismaClientInitializationError: Prisma Client could
 * not locate the Query Engine for runtime "rhel-openssl-3.0.x".This happened
 * because Prisma Client was generated for "windows", but the actual deployment
 * required "rhel-openssl-3.0.x".
 */

const content = fs.readFileSync(prismaFile, 'utf8');
const match = content.match(targetsRegex);
const foundTarget = match && match[2];

console.log('prisma-switch: Found target:', foundTarget);
console.log('prisma-switch: Required target:', requiredTarget);
console.log('prisma-switch: Required provider:', requiredProvider);

if (match && requiredTarget !== foundTarget) {
  console.log('prisma-switch: Replacing...');
  let newContent = content.replace(providerRegex, '$1' + requiredProvider + '$3');
  // Replace build target...
  newContent = newContent.replace(targetsRegex, '$1' + requiredTarget + '$3');
  fs.writeFileSync(prismaFile, newContent);
  console.log('prisma-switch: OK');
} else {
  console.log('prisma-switch: No changes are required, done.');
  process.exit(1);
}
