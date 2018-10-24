import { Component } from '@angular/core';
declare var Window;
@Component({
	selector: 'app-confirm',
	templateUrl: './confirm.component.html',
	styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
	showConfirm:boolean = false;
	content;
	callback;
	cancel:boolean = true;
	constructor() {

	}
	viewConfirm(content,callback,cancel){
		this.cancel = cancel;
		console.log(this.cancel,cancel);
		this.content = content;
		this.showConfirm = true;
		this.callback = callback;
	}
	confirm(){
		this.callback();
		this.showConfirm = false;
	}
}
