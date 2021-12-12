import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-createreport',
  templateUrl: './createreport.component.html',
  styleUrls: ['./createreport.component.css']
})
export class CreatereportComponent implements OnInit {
  srcResault: any;
  fileName:any;
  constructor() { }

  ngOnInit() {
  }

  onFileSelected(){
  const InputNode: any = document.querySelector('#file');
  if (typeof(FileReader) !== 'undefined'){
    const reader = new FileReader();
    reader.onload = (e:any)=>{
      this.srcResault = e.target.result;
    }
    this.fileName = InputNode.files[0].name
    reader.readAsArrayBuffer(InputNode.files[0])
  }
}

}
