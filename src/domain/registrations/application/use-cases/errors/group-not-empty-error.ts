export class GroupNotEmptyError extends Error {
  constructor() {
    super("Group cannot be deleted because it's not empty");
  }
}
