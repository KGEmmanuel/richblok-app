<<<<<<< HEAD
import { Observable } from 'rxjs';

export interface IBaseService<T> {
  get(id: string): Observable<T>;
  list(): Observable<T[]>;
  add(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: string): void;
  findBy(key: string, values: object);

}
=======
import { Observable } from 'rxjs';

export interface IBaseService<T> {
  get(id: string): Observable<T>;
  list(): Observable<T[]>;
  add(item: T): Promise<T>;
  update(item: T): Promise<T>;
  delete(id: string): void;
  findBy(key: string, values: object);

}
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
