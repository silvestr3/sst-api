export class GroupNotEmptyError extends Error {
  constructor() {
    super('Grupo não pode ser deletado pois não está vazio');
  }
}
