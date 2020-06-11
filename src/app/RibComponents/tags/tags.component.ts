<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
=======
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { Utilisateur } from 'src/app/shared/entites/Utilisateur';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss']
})
export class TagsComponent implements OnInit {
  tags = [];
  tag: string;
<<<<<<< HEAD
=======
  @Output()
  tagsAdded = new EventEmitter<string>();
  @Output()
  tagsRemoved = new EventEmitter<string>();
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }
  addTag() {
<<<<<<< HEAD
    if (this.tags.includes (this.tag.toLowerCase())) {
=======
    if (this.tags.includes(this.tag.toLowerCase())) {
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
      this.toastr.error('Tag alrady exist', 'Error');
      return;
    }

    this.toastr.success('Added succesfully', 'Success');
    this.tags.push(this.tag.toLowerCase());
<<<<<<< HEAD
    this.tag = '';
    }

  deleteTag(i: number): void{
      this.tags.splice(i, 1);
    }
=======
    this.tagsAdded.emit(this.tag.toLowerCase());
    this.tag = '';
  }

  deleteTag(i: number): void {
    this.tags.splice(i, 1);
    this.tagsRemoved.emit(this.tag.toLowerCase());
  }
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
}
