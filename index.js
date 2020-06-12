const activeWin = require('active-win');
let importedclasses= require("./activity.js");
const {ActivityList} = require("./activity.js");
const {TimeEntry} = require("./activity.js");
const {Activity} = require("./activity.js");
const fs= require("fs");
let activity; 
//let data = JSON.parse(fs.readFileSync("activities.json",encoding="utf-8"));
let date = new Date();
const interval = setInterval(getActive, 1000);
let previous_window = String();
let start_time = Date.now();
let end_time=0;
let diff=0
let first=true;
let activity_name="";
let time_entry="";
let exist=false;
let activeList = new  ActivityList([]);

async function getActive() {
	let active_window = await activeWin();

	active_window = String(active_window.title);
	if (previous_window !== active_window) {

		console.log(previous_window);
		console.log(time_entry)
		console.log();
		console.log(activity);
		console.log();
		console.log(activeList.activities.TimeEntry);
		console.log();
		console.log()
		
		activity_name=previous_window;
	
	//previous_window = active_window;
		if(!first)
		{
			end_time=Date.now();
			time_entry= new TimeEntry(start_time, end_time, 0, 0, 0, 0);
			time_entry.timecalculation();
			exist=false;
			//console.log(activeList)
			activeList.activities.forEach((item,index)=>{
				if(activity_name===item)
				{
					exist=true;
					item.time_entry.push(time_entry);
					
				}
			})
			if(!exist)
			{
				activity = new Activity(activity_name,[time_entry]);
				activeList.activities.push(activity);
				//fs.writeFile("activities.json",JSON.stringify(activeList.serialize(),null,4),encoding="utf-8");
				//console.log(activeList)
				start_time=Date.now();
			}

		}
		first=false;
		previous_window=active_window
	}

	
	
}