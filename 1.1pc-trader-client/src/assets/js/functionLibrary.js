Window.MA = function(dayCount,data){
	var result = [];
	for (var i = 0, len = data.length; i < len; i++) {
		if (i < dayCount) {
			result.push('-');
			continue;
		}
		var sum = 0;
		for (var j = 0; j < dayCount; j++) {
			sum += data[i - j];
		}
		if((sum / dayCount) != '-'){
			result.push((sum / dayCount).toFixed(7));
		}
		else{
			result.push(sum / dayCount);
		}
	}
	return result;
};
//周期收盘价
Window.CLOSE = [];

Window.colorVolList = function(dataArr){
	var list = [];
	for(var i=0,r=dataArr.length;i<r;i++){
		if(i == 0){
			if(dataArr[i] < 50){
				list.push('#99ffff');
			}
			else{
				list.push('#ff0000');
			}
		}
		else{
			if(dataArr[i] > dataArr[i-1]){
				list.push('#ff0000');
			}
			else{
				list.push('#99ffff');
			}
		}
	}
	return list;
};
Window.MACD = function(dataArr,_short,_long,_mid){
	/* dataArr：收盘价数组 */
	if(!dataArr){
		return;
	}
	var short = parseInt(_short),
		long = parseInt(_long),
		mid = parseInt(_mid);
	var baseEMA12 = 0,baseEMA26 = 0,baseDEA = 0,DIFF=[],DEA=[],MACD=[],EMA12=[],EMA26=[],tmpEMA12 = 0,tmpEMA26 = 0,tmpDEA = 0,result,i,r;
	for(i=0,r=dataArr.length;i<r;i++){
		if(i < short){
			baseEMA12 += parseFloat(dataArr[i]);
		}
		if(i < long){
			baseEMA26 += parseFloat(dataArr[i]);
		}
	}
	baseEMA12 = baseEMA12/short;
	baseEMA26 = baseEMA26/long;
	for(i=0,r=dataArr.length;i<r;i++){
		if(i == 0){
			tmpEMA12 = baseEMA12;
			tmpEMA26 = baseEMA26;
		}
		else{
			tmpEMA12 = tmpEMA12*11/13+parseFloat(dataArr[i])*2/13;
			tmpEMA26 = tmpEMA26*25/27+parseFloat(dataArr[i])*2/27;
		}
		EMA12.push(tmpEMA12*11/13+parseFloat(dataArr[i])*2/13);
		EMA26.push(tmpEMA26*25/27+parseFloat(dataArr[i])*2/27);
		DIFF.push(tmpEMA12-tmpEMA26);
	}
	for(i=0,r=DIFF.length;i<r;i++){
		if(i<mid){
			baseDEA += parseFloat(DIFF[i]);
		}
	}
	baseDEA = baseDEA/mid;

	for(i=0,r=DIFF.length;i<r;i++){
		
		if(i == 0){
			tmpDEA = baseDEA;
		}
		else{
			tmpDEA = tmpDEA*8/10+DIFF[i]*2/10;
		}

		DEA.push(tmpDEA);
		MACD.push((DIFF[i]-tmpDEA)*2);
	}
	result = [DIFF,DEA,MACD];
	return result;
};
Window.KDJ = function(dataArr,_N,_M1,_M2){
	//默认参数
	var N = parseInt(_N),
		M1 = parseInt(_M1),
		M2 = parseInt(_M2);
	//Cn为第n日收盘价；Ln为n日内的最低价；Hn为n日内的最高价
	var lowArr=[],highArr=[],Cn,Ln,Hn,k=50,d=50,j,kArr=[],dArr=[],jArr=[],RSV = 0,close,kdjArr=[];
	for(var i=0,r=dataArr.length;i<r;i++){
		lowArr=[];
		highArr=[];
		for(var x=i,z=N+i;x<z;x++){
			if(dataArr[x] != undefined){
				lowArr.push(dataArr[x][2]);
				highArr.push(dataArr[x][3]);
				if(x == (z-1)){
					Cn = dataArr[x][1];
				}
			}
		}
		Ln = lowArr.min();
		Hn = highArr.max();
		RSV = (Cn-Ln)/(Hn-Ln)*100;

		k = 2/3*k+1/M1*RSV;
		d = 2/3*d+1/M2*k;
		j = 3*k-2*d;

		kArr.push(k.toFixed(2));
		dArr.push(d.toFixed(2));
		jArr.push(j.toFixed(2));
	}
	kdjArr.push(kArr,dArr,jArr);
	return kdjArr;
};
//是否整数
Window.isInteger = function(obj) {
	return obj%1 === 0;
};
//应用居中显示
Window.windowCenter = function(w,h){
	var gui = require('nw.gui');
	var win = gui.Window.get();
	var windowW = window.screen.width;
	var windowH = window.screen.height;
	win.x = (windowW-w)/2;
	win.y = (windowH-h)/2;
};
//修复toFixed
Window.toFixed = function(num,s){
	var times = Math.pow(10,s);
	var des = num*times+0.5;
		des = parseInt(des,10)/times;
		return des;
};
