import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TagsService {

  constructor() { }

  public buildTags(val: string[]): string[]{
    const ret: string[] = [];
    val.forEach(element => {
      const type = typeof element;

      if(type==='string'){
        const val = element as string;
        // Split on whitespace, drop empty tokens, flatten into ret.
        // BUG FIX: previously pushed the whole array as a single element,
        // producing a nested array that Firestore rejects.
        val.split(/\s+/).filter(t => t.length > 0).forEach(t => ret.push(t));
      }

    });
    return ret;
  }

}
