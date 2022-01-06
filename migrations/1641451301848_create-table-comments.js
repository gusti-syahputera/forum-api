/* eslint-disable camelcase */

// eslint-disable-next-line no-unused-vars
const { MigrationBuilder } = require('node-pg-migrate/dist/types')
const tableName = 'comments'

exports.shorthands = undefined

/**
 * @param {MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  pgm.createTable(tableName, {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    thread_id: { type: 'VARCHAR(50)', notNull: true },
    owner: { type: 'VARCHAR(50)', notNull: true },
    content: { type: 'TEXT', notNull: true },
    date: { type: 'TEXT', notNull: true },
    deleted_at: { type: 'TEXT' }
  })

  // Indexes
  pgm.addIndex(tableName, 'thread_id')
  pgm.addIndex(tableName, 'owner')

  // Foreign key constraints
  pgm.addConstraint(tableName, 'fk_comments.thread_id_threads.id',
    'FOREIGN KEY(thread_id) REFERENCES threads(id) ON DELETE CASCADE'
  )
  pgm.addConstraint(tableName, 'fk_comments.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

/**
 * @param {MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropTable(tableName)
}
