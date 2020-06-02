import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-evaluate',
  templateUrl: './evaluate.component.html',
  styleUrls: ['./evaluate.component.scss']
})
export class EvaluateComponent implements OnInit {

  constructor(private title: Title, private meta : Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Evaluations');
    this.meta.updateTag({ name: 'description', content: 'Create, participate to challenge created by RchBlok users' });
  }

}
