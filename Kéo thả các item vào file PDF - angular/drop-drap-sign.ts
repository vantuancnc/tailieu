import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { DndDropEvent } from 'ngx-drag-drop';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-drop-drap-sign-pdf',
  templateUrl: './drop-drap-sign-pdf.component.html',
  styleUrls: ['./drop-drap-sign-pdf.component.scss'],
})
export class DropDrapSignPdfComponent implements OnInit, OnChanges {
  
  @Input() url: string
  public listCopy = [];
  public a = 10;
  public checkDrap = false;
  public dragPosition = { x: 0, y: 0 };
  public formPrint = {
    listPage: [],
  };
  public pdfurl =
    'https://res.cloudinary.com/sivadass/image/upload/v1519136548/hr-sample-pdf.pdf';

    async ngOnChanges(changes: SimpleChanges) {
      if (this.url) {
        await this.loadPDF(this.url);
        this.copy();
      }
    }

  async ngOnInit() {
    // await this.loadPDF(this.url);
    // this.copy();
  }

  loadPDF(pdfurl) {
    return new Promise((resole) => {
      pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
      let thePdf = null;
      let scale = 1.2;
      let canvas;
      let viewport;
      let viewer;

      pdfjsLib.getDocument(pdfurl).promise.then(function (pdf) {
        thePdf = pdf;
        viewer = document.getElementById('pdf-viewer');
        for (let page = 1; page <= pdf.numPages; page++) {
          canvas = document.createElement('canvas');
          canvas.className = 'pdf-page-canvas';
          viewer.appendChild(canvas);
          renderPage(page, canvas);
        }
        resole('oke');
      });

      function renderPage(pageNumber, canvas) {
        thePdf.getPage(pageNumber).then(function (page) {
          viewport = page.getViewport({ scale: scale });
          canvas.height = viewport.height;
          canvas.width = viewport.width;
          page.render({
            canvasContext: canvas.getContext('2d'),
            viewport: viewport,
          });
        });
      }
    });
  }

  copy() {
    document.querySelectorAll('canvas').forEach((item, index) => {
      let obj = { listElement: [] };
      this.listCopy.push(obj);
      setTimeout(() => {
        let idElm = 'page-' + index;
        console.log(idElm);
        let tag = document.getElementById(idElm);
        tag.appendChild(item);
      }, 100);
    });
  }

  allowDrop(ev) {
    ev.preventDefault();
  }

  drag(ev) {
    ev.dataTransfer.setData('text', 'test vị trí ký');
  }

  drop(ev, item) {
    ev.preventDefault();
    let rect = ev.currentTarget.getBoundingClientRect();
    let xPdf: any = ev.clientX - rect.left;
    let yPdf: any = ev.clientY - rect.top;
    let widthPdf = ev.target.clientWidth;
    let heightPdf = ev.target.clientHeight;

    let data = ev.dataTransfer.getData('text');
    let obj = {
      id: uuidv4(),
      value: data,
      locationView: { x: Math.round(xPdf), y: Math.round(yPdf) },
      locationSign: { x: Math.round(xPdf), y: heightPdf - (yPdf + 27) },
      width: widthPdf,
      height: heightPdf,
      drap:false
    };
    item.listElement.push(obj);
  }

  dragMoved(e, item) {
    // console.log(e.source.getFreeDragPosition());
    // console.log('đang di chuyển');
    item.drap = true;
  }

  dragEnd($event, item) {
    item.drap = false;
    let pos = $event.source.getFreeDragPosition();
    item.locationView.x = pos.x < 0 ? 0 : +(+pos.x).toFixed();
    item.locationView.y = pos.y < 0 ? 0 : +(+pos.y).toFixed();
    item.locationSign.x = +(item.locationView.x);
    item.locationSign.y = item.height - (item.locationView.y  + 27);
  }

  deleteNode(item,items){
   item.listElement = item.listElement.filter(item=>item.id != items.id);
  }

  submit() {
    console.log('list ký', this.listCopy);
  }
}
