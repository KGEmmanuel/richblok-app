import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() { }

  public buildTags(val: string[]): string[]{
    const ret = [];
    val.forEach(element => {
      const type = typeof element;

      if(type==='string'){
        const val = element as string;
        ret.push(val.split(" "));
      }

    });
    return ret;
  }

}
