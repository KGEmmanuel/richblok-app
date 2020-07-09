import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
  @Output()
  tagsAdded = new EventEmitter<string>();
  @Output()
  tagsRemoved = new EventEmitter<string>();
  constructor(private toastr: ToastrService) { }

  ngOnInit() {
  }
  addTag() {
    if (this.tags.includes(this.tag.toLowerCase())) {
      this.toastr.error('Tag alrady exist', 'Error');
      return;
    }

    this.toastr.success('Added succesfully', 'Success');
    this.tags.push(this.tag.toLowerCase());
    this.tagsAdded.emit(this.tag.toLowerCase());
    this.tag = '';
  }

  deleteTag(i: number): void {
    this.tags.splice(i, 1);
    this.tagsRemoved.emit(this.tag.toLowerCase());
  }
}
