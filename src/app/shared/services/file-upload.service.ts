import { Injectable, inject } from '@angular/core';
import { Storage, ref as storageRef, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  private storage = inject(Storage);

  constructor() { }

  uploadFiles(path: string, files: File[]) {

    return Promise.all(
      files.map(f => this.putStorageItem(path, f))
    );


  }

  putStorageItem(path: string, item: File) {
    const filePath = path + '/' + '_' + (new Date().getMilliseconds()) + item.name;
    return uploadBytes(storageRef(this.storage, path), item)
      .then(() => {
        console.log('One success:', item);
      }).catch((error: any) => {
        console.log('One failed:', item, error.message);
      });
  }


}
