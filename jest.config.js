/* istanbul ignore file */
module.exports = {
  roots: ['src'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  setupFilesAfterEnv: ['./jest.setup.ts'],
  globals: {
    'ts-jest': { compiler: 'ttypescript' }
  }
}
