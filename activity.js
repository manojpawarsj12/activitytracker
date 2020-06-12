
const dateutil= require("dateutil");
const fs = require("fs");
const strftime=require("strftime");
let data="";

class TimeEntry{
	constructor( start_time, end_time, days, hours, minutes, seconds) {
        this.start_time = start_time;
        this.end_time = end_time;
        this.total_time = (end_time - start_time)/1000;
        this.days = days;
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
	}
	 timecalculation()
	{
		this.days = this.days;
		this.seconds = this.seconds;
        this.hours = this.days * 24 + this.seconds; // 3600
        this.minutes = (this.seconds % 3600); // 60;
        this.seconds = this.seconds % 60;
	}
	
	 serialise()
	{
		return {
            'start_time' : strftime("%Y-%m-%d %H:%M:%S",this.start_time),
            'end_time' : strftime("%Y-%m-%d %H:%M:%S",this.end_time),
            'days' : this.days,
            'hours' : this.hours,
            'minutes' : this.minutes,
            'seconds' : this.seconds
        }
	}
}

class Activity{
	constructor(name,time_entries) {
		this.name = name;
		this.time_entries = time_entries;
	}
	 serialise()
	{
		return {
			"name": this.name,
			"time_entries" : this.make_time_series_json()
		}
	}

	make_time_series_json()
	{
		let time_list=[]
		time_entries.forEach(function(item,index){
			
			time_list.push(item.serialise());
		})

		return time_list;

	}
}

class ActivityList{
	constructor(activities) {
		this.activities = activities;
	}
	 initialise_me(){
		data = JSON.parse(fs.readFileSync("activities.json",encoding="utf-8"));
		let activity_list=new ActivityList([]);
		activity_list= new ActivityList(this.get_activities_from_json);
		return activity_list;
		
	}
	 get_activities_from_json(data)
	{
		return_list=[];
		data["activities"].forEach((key,index)=>{
			return_list.push(new Activity(
					name=activity["name"],
					time_entries=this.get_time_entries_from_json(activity)
				)
			)
		}
		)
		this.activities=return_list;
		return return_list;
	}
	 get_time_entries_from_json(data)
	{
		let return_list=[];
		data["time_entries"].forEach((key,value)=>
		{
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
		this.time_entries=return_list;
		return return_list;
	}
	 serialise()
	{
		return {
			"activities":this.activities_to_json(this)
		}
	}
	 activities_to_json()
	{
		let activity_=[];
		this.activities.forEach((item,value)=>{
			activity_.push(this.activity.serialise());
		})

		return activity_;
	}
}

module.exports={
	TimeEntry,
	Activity,
	ActivityList
}