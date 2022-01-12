const tableName = 'threads'

exports.shorthands = undefined

exports.up = (pgm) => {
  pgm.createTable(tableName, {
    id: { type: 'VARCHAR(50)', primaryKey: true },
    title: { type: 'VARCHAR(100)', notNull: true },
    body: { type: 'TEXT', notNull: true },
    owner: { type: 'VARCHAR(50)', notNUll: true },
    date: { type: 'TEXT', notNull: true }
  })

  pgm.addConstraint(
    tableName,
    'fk_playlists.owner_users.id',
    'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
  )
}

exports.down = (pgm) => {
  pgm.dropTable(tableName)
}
