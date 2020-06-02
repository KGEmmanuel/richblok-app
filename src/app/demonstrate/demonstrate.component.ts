import { Title, Meta } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demonstrate',
  templateUrl: './demonstrate.component.html',
  styleUrls: ['./demonstrate.component.scss']
})
export class DemonstrateComponent implements OnInit {



  constructor(private title: Title, private meta: Meta) { }

  ngOnInit() {
    this.title.setTitle('RichBlok | Demonstrations');
    this.meta.updateTag({ name: 'description', content: 'Demonstrate your soft skills to make the RichBlok community more informed on the skill' });
  }


}
