export class MruTracker {
  private readonly order: string[] = []; // index 0 = most recent

  recordActivation(id: string): void {
    const idx = this.order.indexOf(id);
    if (idx !== -1) this.order.splice(idx, 1);
    this.order.unshift(id);
  }

  remove(id: string): void {
    const idx = this.order.indexOf(id);
    if (idx !== -1) this.order.splice(idx, 1);
  }

  /** Adds ids not already tracked, at the back (least-recent), without disturbing known order. */
  seed(ids: string[]): void {
    for (const id of ids) {
      if (!this.order.includes(id)) this.order.push(id);
    }
  }

  getOrdered(excluding?: string): string[] {
    return excluding === undefined ? [...this.order] : this.order.filter((id) => id !== excluding);
  }
}
