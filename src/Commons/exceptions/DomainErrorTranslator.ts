import InvariantError from './InvariantError'
import AuthorizationError from './AuthorizationError'
import NotFoundError from './NotFoundError'
import AuthenticationError from './AuthenticationError'

export default class DomainErrorTranslator {
  private static readonly directories = {
    // Authentication (mechanism)
    'AUTHENTICATION.INVALID_CREDENTIALS': new AuthenticationError('kredensial yang Anda masukkan salah'),
    'AUTHENTICATION.INVALID_REFRESH_TOKEN': new InvariantError('refresh token tidak valid'),
    'USERNAME.NOT_FOUND': new InvariantError('username tidak ditemukan'),
    'USER.NOT_FOUND': new InvariantError('user tidak ditemukan'),
    'REFRESH_TOKEN.NOT_FOUND': new InvariantError('refresh token tidak ditemukan di database'),
    'USERNAME.ALREADY_TAKEN': new InvariantError('username tidak tersedia'),

    // Authentications  (entity)
    'REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'),
    'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'),
    'REGISTER_USER.USERNAME_LIMIT_CHAR': new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'),
    'REGISTER_USER.USERNAME_CONTAIN_RESTRICTED_CHARACTER': new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'),
    'USER_LOGIN.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('harus mengirimkan username dan password'),
    'USER_LOGIN.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('username dan password harus string'),
    'REFRESH_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'REFRESH_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),
    'DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN': new InvariantError('harus mengirimkan token refresh'),
    'DELETE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('refresh token harus string'),

    // Threads
    'NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada'),
    'NEW_THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat thread baru karena tipe data tidak sesuai'),
    'THREAD.NOT_FOUND': new NotFoundError('thread tidak ada'),

    // Comments
    'NEW_COMMENT.THREAD_NOT_FOUND': new NotFoundError('tidak dapat membuat comment baru karena thread tidak ada'),
    'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
    'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
    'DELETE_COMMENT.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena thread tidak ada'),
    'DELETE_COMMENT.COMMENT_DOES_NOT_BELONG_TO_THREAD': new InvariantError('tidak dapat menghapus comment karena comment tidak ada pada thread'),
    'DELETE_COMMENT.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena comment tidak ada'),
    'DELETE_COMMENT.USER_IS_NOT_OWNER': new AuthorizationError('tidak dapat menghapus comment karena Anda bukan pemilik comment ini'),

    // Replies
    'NEW_REPLY.THREAD_NOT_FOUND': new NotFoundError('tidak dapat membuat reply baru karena thread tidak ada'),
    'NEW_REPLY.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat membuat reply baru karena comment tidak'),
    'NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat reply baru karena properti yang dibutuhkan tidak ada'),
    'NEW_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat reply baru karena tipe data tidak sesuai'),
    'DELETE_REPLY.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus reply karena thread tidak ada'),
    'DELETE_REPLY.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menghapus reply karena comment tidak ada'),
    'DELETE_REPLY.REPLY_NOT_FOUND': new NotFoundError('tidak dapat menghapus reply karena reply tidak ada'),
    'DELETE_REPLY.USER_IS_NOT_OWNER': new AuthorizationError('tidak dapat menghapus reply karena Anda bukan pemilik reply ini')
  }

  static translate (error): any {
    return DomainErrorTranslator.directories[error.message] ?? error
  }
}
