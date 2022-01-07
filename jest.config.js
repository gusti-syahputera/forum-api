/* istanbul ignore file */
module.exports = {
  roots: ['src'],
  transform: { '^.+\\.tsx?$': 'ts-jest' },
  setupFilesAfterEnv: ['./src/jest.setup.ts'],
  globals: {
    'ts-jest': { compiler: 'ttypescript' }
  }
}
