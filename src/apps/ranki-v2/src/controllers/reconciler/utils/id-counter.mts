export class IdCounter {
  private static idCounter = 0;

  public static getNewId() {
    return this.idCounter++;
  }
}
