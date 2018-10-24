import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
	selector: 'app-risk-tip',
	templateUrl: './risk-tip.component.html',
	styleUrls: ['./risk-tip.component.css']
})
export class RiskTipComponent implements OnInit {

	constructor(public sanitizer: DomSanitizer,private router: Router) { }

	private baseConfig = JSON.parse(localStorage.getItem("baseConfig"));
	frameUrl;
	ngOnInit() {
		this.frameUrl = this.sanitizer.bypassSecurityTrustResourceUrl("/assets/localData/"+this.baseConfig.id+"/"+this.baseConfig.riskTip);
	}
	/* 返回 */
	goBack(){
		this.router.navigate(['/login']);
	}
}
