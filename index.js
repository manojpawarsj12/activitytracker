const activeWin = require("active-win");
const jsonfile = require("jsonfile");

const {
	ActivityList
} = require("./activity.js");
const {
	TimeEntry
} = require("./activity.js");
const {
	Activity
} = require("./activity.js");
const fs = require("fs");
let activity;
let date = new Date();

let previous_window = String();
let start_time = Date.now();
let end_time = 0;
let first = true;
let activity_name = "";
let time_entry = "";
let exist = false;
let activeList = new ActivityList([]);
let file = "activities.json";
const interval = setInterval(getActive, 1000);

async function getActive() {
	let active_window = await activeWin();

	active_window_path = String(active_window.owner.name);
	if (previous_window !== active_window_path) {
		console.log(previous_window);

		//console.log(JSON.stringify(activeList.activities[0]));

		activity_name = previous_window;

		//previous_window = active_window_path ;
		if (!first) {
			end_time = Date.now();
			time_entry = new TimeEntry(start_time, end_time, 0, 0, 0, 0);
			time_entry.timecalculation();
			exist = false;
			
			activeList.activities.forEach((key, value) => {
				
				if (key.name === active_window_path) {
					exist = true;
					key.time_entries.push(time_entry);
				}
			})
			if (!exist) {
				activity = new Activity(activity_name, [time_entry]);
				
				activeList.activities.push(activity);
			}
		
			jsonfile.writeFile(file, activeList,{
				spaces: 4,
			});

			start_time = Date.now();
		}
		first = false;
		previous_window = active_window_path;
	}
}