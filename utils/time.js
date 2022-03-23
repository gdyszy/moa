export function timeStamp(value){
	if (!value) return '';
	var now = new Date(value);
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	return year + "-" + month + "-" + date
}

export function timeDate(value){
	if (!value) return '';
	var now = new Date(value*1000);
	
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	return  month + "-" + date
}

export function timeMinute(value){
	if (!value) return '';
	var now = new Date(value*1000);
	
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	var hour = now.getHours();
	if (hour < 10) {
		hour = '0' + hour
	}
	var minute = now.getMinutes();
	if (minute < 10) {
		minute = '0' + minute
	}
	return  month + "-" + date + "-" + hour + "-" + minute
}

	//格式化时间
export function formatChatTime(time){
		time = dateFormat("YY-mm-dd HH:MM:SS", new Date(time));
		var date = time.toString();
		var year = date.split("-")[0];
		var month = date.split("-")[1];
		var day = date.split("-")[2];
		var d1 = new Date(year + '/' + month + '/' + day.split(" ")[0]);
		var d3 = new Date(date.replace(/-/g, "/"));
		var dd = new Date();
		var y = dd.getFullYear();
		var m = dd.getMonth() + 1;
		var d = dd.getDate();
		var d2 = new Date(y + '/' + m + '/' + d);
		var iday = parseInt(d2 - d1) / 1000 / 60 / 60 / 24;
		var hours = d3.getHours();
		var minutes = d3.getMinutes();
		if (minutes < 10) {
			minutes = '0' + minutes;
		}
		if (hours < 10) {
			hours = '0' + hours;
		}
		/* if (iday == 0) {
			if (hours >= 12) {
				return "下午 " + hours + ":" + minutes;
			} else {
				return "上午 " + hours + ":" + minutes;;
			}
		} else if (iday == 1) {
			var dt = "";
			if (hours >= 12) {
				dt = "下午 " + hours + ":" + minutes;
			} else {
				dt = "上午 " + hours + ":" + minutes;;
			}
			return "昨天 " + dt;
		} else if (iday == 2) {
			var dt = "";
			if (hours >= 12) {
				dt = "下午 " + hours + ":" + minutes;
			} else {
				dt = "上午 " + hours + ":" + minutes;;
			}
			return "前天 " + dt;
		} else {
			return year + '/' + month + "/" + d1.getDate()
		} */
		if (iday == 0) {
			if (hours >= 12) {
				return hours + ":" + minutes;
			} else {
				return hours + ":" + minutes;;
			}
		} else if (iday == 1) {
			var dt = "";
			if (hours >= 12) {
				dt = hours + ":" + minutes;
			} else {
				dt = hours + ":" + minutes;;
			}
			return "昨天 " + dt;
		} else if (iday == 2) {
			var dt = "";
			if (hours >= 12) {
				dt = hours + ":" + minutes;
			} else {
				dt = hours + ":" + minutes;;
			}
			return "前天 " + dt;
		} else {
			return year + '/' + month + "/" + d1.getDate()
		}
	}
	
export function dateFormat(fmt, date) {
		let ret;
		const opt = {
			"Y+": date.getFullYear().toString(), // 年
			"m+": (date.getMonth() + 1).toString(), // 月
			"d+": date.getDate().toString(), // 日
			"H+": date.getHours().toString(), // 时
			"M+": date.getMinutes().toString(), // 分
			"S+": date.getSeconds().toString() // 秒
		};
		for (let k in opt) {
			ret = new RegExp("(" + k + ")").exec(fmt);
			if (ret) {
				fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
			};
		};
		return fmt;
	}
export function yearMonthDateMin(value){
	if (!value) return '';
	var now = new Date(value);
	var year = now.getFullYear();
	var month = now.getMonth() + 1;
	if (month < 10) {
		month = '0' + month
	}
	var date = now.getDate();
	if (date < 10) {
		date = '0' + date
	}
	var hour = now.getHours();
	if (hour < 10) {
		hour = '0' + hour
	}
	var minute = now.getMinutes();
	if (minute < 10) {
		minute = '0' + minute
	}
	return year + "-" + month + "-" + date + " " + hour + ":" + minute
}



 
    
