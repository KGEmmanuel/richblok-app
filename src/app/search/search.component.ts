import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private title: Title, private meta: Meta) { }

  ngOnInit(): void {
    this.title.setTitle('RichBlok | Search');
    this.meta.updateTag({ name: 'description', content: 'Search result on jobs, skills, connections, experiences, evaluations, trainings, certifications' });
  }

}
