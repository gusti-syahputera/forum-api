module.exports = {
  root: true,
  extends: 'standard',
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: 'standard-with-typescript',
      parserOptions: {
        project: ['./tsconfig.eslint.json']
      }
    }
  ]
}
