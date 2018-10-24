import { Component,ChangeDetectorRef,Inject } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
	showAlert:boolean = false;
	content:string;
	cd;
	constructor(@Inject(ChangeDetectorRef) cd) {
		this.cd = cd;
	}
	msg(content) {
		this.showAlert = true;
		this.content = content;
		var self = this;
		setTimeout(function(){
			self.showAlert = false;
			self.cd.markForCheck();
		},3000);
	}
}
