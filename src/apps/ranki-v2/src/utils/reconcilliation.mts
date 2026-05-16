export interface ReconcileableType {
  leave: boolean;
}

export class ReconciliationUtils {
  public static flat<G extends ReconcileableType, T = G>(
    curr: T[],
    prev: G[],
    getId: () => number,
  ) {
    const updated = curr.map((v) => ({
      ...v,
      id: getId(),
      leave: false,
    })) as unknown as G[];

    if (prev.length > updated.length) {
      for (let i = updated.length; i < prev.length; i++) {
        updated.push({
          ...prev[i],
          leave: true,
        } as G);
      }
    }
    return updated;
  }
}
