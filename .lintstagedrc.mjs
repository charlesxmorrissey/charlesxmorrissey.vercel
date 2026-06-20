export default {
  // ponytail: prettier gets the staged files; lint + tests ignore them and
  // run project-wide (tsc needs the whole project; coverage needs the full suite).
  '*.{css,html,js,md,mjs,ts,tsx}': [
    'prettier --write',
    () => 'yarn lint',
    () => 'yarn test:coverage',
  ],
}
