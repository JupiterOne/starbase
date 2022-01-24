import { createStarbaseCli } from './cli';

createStarbaseCli()
  .parseAsync(process.argv)
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  });
