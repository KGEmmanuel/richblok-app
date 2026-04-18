import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-certify-item',
  templateUrl: './certify-item.component.html',
  styleUrls: ['./certify-item.component.scss']
})
export class CertifyItemComponent implements OnInit {

  closeResult: string;
  currentRate: number = 0;
  level: string;

  // D2: NgbModal replaces Bootstrap data-toggle="modal" so we can drop the
  // bootstrap.min.js + popper dependencies in Phase E.
  constructor(private modalService: NgbModal) {}

  ratechnged(event) {
    // tslint:disable-next-line: align
  }

  openCertify(tpl: TemplateRef<any>) {
    this.modalService.open(tpl, { ariaLabelledBy: 'certify-modal' });
  }

  ngOnInit() {}
}
