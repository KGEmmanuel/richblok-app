import { Injectable } from '@angular/core';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }

  uploadFiles(path: string, files: File[]) {

    return Promise.all(
      files.map(f => this.putStorageItem(path, f))
    );


  }

  putStorageItem(path, item) {
    // the return value will be a Promise
    const filePath = path + '/' + '_' + (new Date().getMilliseconds()) + item.name;
    return firebase.storage().ref(path).put(item)
    .then((snapshot) => {
      console.log('One success:', item);
    }).catch((error) => {
      console.log('One failed:', item, error.message);
    });
  }


}
