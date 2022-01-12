// eslint-disable-next-line no-unused-vars
const { MigrationBuilder } = require('node-pg-migrate/dist/types')
const tableName = 'replies'

exports.shorthands = undefined

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = pgm => {
  pgm.createTable(tableName, {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    comment_id: { type: 'VARCHAR(50)', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
    content: { type: 'TEXT', notNull: true },
    date: { type: 'TEXT', notNull: true },
    deleted_at: { type: 'TEXT' }
  })

  // Indexes
  pgm.addIndex(tableName, 'comment_id')
  pgm.addIndex(tableName, 'owner')

  // Foreign key constraints
  pgm.addConstraint(tableName, 'fk_replies.comment_id_comments.id',
    'FOREIGN KEY(comment_id) REFERENCES comments(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(tableName, 'fk_replies.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = pgm => {
  pgm.dropTable(tableName)
}
