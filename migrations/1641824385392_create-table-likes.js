// eslint-disable-next-line no-unused-vars
const { MigrationBuilder } = require('node-pg-migrate/dist/types')

const tableName = 'likes'

exports.shorthands = undefined

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.createTable(tableName, {
    comment_id: { type: 'VARCHAR(50)', primaryKey: true },
    user_id: { type: 'VARCHAR(50)', primaryKey: true }
  })

  // Foreign key constraints
  pgm.addConstraint(tableName, 'fk_likes.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(tableName, 'fk_likes.user_id_users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE'
  )
}

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = pgm => {
  pgm.dropTable(tableName)
}
