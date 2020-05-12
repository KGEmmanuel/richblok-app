import { Observable } from 'rxjs';

export interface IBaseService<T> {
  get(id: string): Observable<T>;
  list(): Observable<T[]>;
  add(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: string): void;
  findBy(key: string, values: object);

}
