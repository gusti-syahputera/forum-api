import InvariantError from './InvariantError'
import AuthorizationError from './AuthorizationError'
import NotFoundError from './NotFoundError'

export default class DomainErrorTranslator {
  private static readonly directories = {
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

    // Comments
    'NEW_COMMENT.THREAD_NOT_FOUND': new NotFoundError('tidak dapat membuat comment baru karena thread tidak ada'),
    'NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY': new InvariantError('tidak dapat membuat comment baru karena properti yang dibutuhkan tidak ada'),
    'NEW_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION': new InvariantError('tidak dapat membuat comment baru karena tipe data tidak sesuai'),
    'DELETE_COMMENT.THREAD_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena thread tidak ada'),
    'DELETE_COMMENT.COMMENT_DOES_NOT_BELONG_TO_THREAD': new InvariantError('tidak dapat menghapus comment karena comment tidak ada pada thread'),
    'DELETE_COMMENT.COMMENT_NOT_FOUND': new NotFoundError('tidak dapat menghapus comment karena comment tidak ada'),
    'DELETE_COMMENT.USER_IS_NOT_OWNER': new AuthorizationError('tidak dapat menghapus comment karena Anda bukan pemilik comment ini')
  }

  static translate (error): any {
    return DomainErrorTranslator.directories[error.message] ?? error
  }
}
