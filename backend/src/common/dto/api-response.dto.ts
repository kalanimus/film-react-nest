export class ApiListResponse<T> {
  total: number;
  items: T[];

  constructor(items: T[]) {
    this.items = items;
    this.total = items.length;
  }
}
