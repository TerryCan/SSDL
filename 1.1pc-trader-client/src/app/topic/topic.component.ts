import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';

@Component({
	selector: 'app-topic',
	templateUrl: './topic.component.html',
	styleUrls: ['./topic.component.css']
})
export class TopicComponent implements OnInit {

	constructor(private _http:HttpService) { }
	topicList:Array<any> = [];
	filterTopicList:Array<any> = [];
	currentTopic;
	readDetail:boolean = false;
	ngOnInit() {
		this.getNoticeList();
	}
	/* 获取公告列表 */
	getNoticeList():void {
		let self = this;
		this._http.postForm("notice/query/by/user",{page:1,rows:999},function(res){
			let data = JSON.parse(res.content)
			self.topicList = data.content;
			self.filterTopicList = self.topicList;
		});
	}
	/* 阅读公告 */
	readNotice(index,id,readFlag){
		this.currentTopic = this.filterTopicList[index];
		this.readDetail = true;
		let self = this;
		if(readFlag == 0){
			this._http.postJson("notice/read",{key:id},function(res){
				self.filterTopicList[index].readFlag = 1;
			});
		}
	}
	/* 根据标题过滤 */
	sTitle:string;
	searchTitle(){
		this.filterTopicList = [];
		for(let i=0,r=this.topicList.length;i<r;i++){
			if(this.topicList[i].title.indexOf(this.sTitle) != -1){
				this.filterTopicList.push(this.topicList[i]);
			}
		}
	}
	/* 根据是否阅读过滤 */
	readFlag:number = -1;
	readFlagFilter(){
		if(this.readFlag == -1){
			this.filterTopicList = this.topicList;
		}
		else{
			this.filterTopicList = [];
			for(let i=0,r=this.topicList.length;i<r;i++){
				if(this.topicList[i].readFlag == this.readFlag){
					this.filterTopicList.push(this.topicList[i]);
				}
			}	
		}
	}
}
