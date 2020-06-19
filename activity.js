const dateutil = require("dateutil");
const fs = require("fs");
const strftime = require("strftime");
let data = "";

class TimeEntry {
	constructor(start_time, end_time, days, hours, minutes, seconds) {
		this.start_time = start_time;
		this.end_time = end_time;
		this.total_time = (end_time - start_time) / 1000;
		this.days = days;
		this.hours = hours;
		this.minutes = minutes;
		this.seconds = seconds;
	}
	timecalculation() {
		this.days = this.days;
		this.seconds = this.seconds;
		this.hours = this.days * 24 + this.seconds; // 3600
		this.minutes = (this.seconds % 3600); // 60;
		this.seconds = this.seconds % 60;
	}

	serialize() {
		return {
			'start_time': strftime("%Y-%m-%d %H:%M:%S", new Date(this.start_time)),
			'end_time': strftime("%Y-%m-%d %H:%M:%S", new Date(this.end_time)),
			'days': this.days,
			'hours': this.hours,
			'minutes': this.minutes,
			'seconds': this.seconds
			//'totaltime': this.total_time
		}
	}
}

class Activity {
	constructor(name, time_entries) {
		this.name = name;
		this.time_entries = time_entries;
	}
	serialize() {
		return {
			"name": this.name,
			"time_entries": this.make_time_series_json()
		}
	}

	make_time_series_json() {
		let time_list = []
		for(let time in this.time_entries)
		{
			time_list.push(time.serialize())
		}

		return time_list;

	}
}

class ActivityList {
	constructor(activities) {
		this.activities = activities;
	}
	initialise_me() {
		data = JSON.parse(fs.readFileSync("activities.json", encoding = "utf-8"));
		let activity_list = new ActivityList([]);
		activity_list = new ActivityList(this.get_activities_from_json);
		return activity_list;

	}
	get_activities_from_json(data) {
		return_list = [];
		data["activities"].forEach((key, index) => {
			return_list.push(new Activity(
				name = activity["name"],
				time_entries = this.get_time_entries_from_json(activity)
			))
		})
		this.activities = return_list;
		return return_list;
	}
	get_time_entries_from_json(data) {
		let return_list = [];
		data["time_entries"].forEach((key, value) => {
			return_list.push(
				new TimeEntry(
					start_time = dateutil.parse(key['start_time']),
					end_time = dateutil.parse(key['end_time']),
					days = entry['days'],
					hours = entry['hours'],
					minutes = entry['minutes'],
					seconds = entry['seconds'],

				)
			)
		})
		this.time_entries = return_list;
		return return_list;
	}
	serialize() {
		return {
			"activities": this.activities_to_json()
		}
	}
	activities_to_json() {
		let activity_ = [];
		for (let activity in this.activities)
		{
			activity_.push(activity.serialize());
		}
		
		return activity_;
	}
}

module.exports = {
	TimeEntry,
	Activity,
	ActivityList
}