<<<<<<< HEAD
=======
import { Title, Meta } from '@angular/platform-browser';
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {

<<<<<<< HEAD
  constructor() { }

  ngOnInit() {
=======
  constructor(private title: Title, private meta : Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Evaluations');
    this.meta.updateTag({ name: 'description', content: 'Create, participate to challenge created by RchBlok users' });
>>>>>>> b5446b2a5deb6a99c0106b8227a23d0ad7d05dbe
  }

}
