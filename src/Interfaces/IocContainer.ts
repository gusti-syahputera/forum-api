export default interface IocContainer {
  resolve: <T>(token) => T
}
