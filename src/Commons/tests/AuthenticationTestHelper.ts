/* istanbul ignore file */
export default {
  getJwtAuthBypass: (userId) => ({
    strategy: 'JWT',
    credentials: { userId }
  })
}
