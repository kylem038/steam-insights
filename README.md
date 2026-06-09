# Steam Insights

## Purpose

The purpose of the project is two-fold. 
1. Test out OpenCode for AI-assisted development
2. Provide a way to aggregate Steam data in to provide insights into game performance without paying. 

### OpenCode
I've heard a lot of good things regarding OpenCode. The biggest benefit so far is that it's open source. I prefer using open source tooling whenever possible. 
The next benefit is that it doesn't pigeon hole you into only using one model. What if the price of one model skyrockets? What if a model goes away altogether? Flexibility is key as the AI landscape changes on a day-by-day basis. 
Additionally, I can swap out different models for different purposes. If I'm doing some arbitrary tasks I can use a cheaper model, and use a heavier model for more complex tasks. 

### Insights into Steam data
As a game dev I'd often refer to a particular website to see the performance of different games as they launch and over their lifetime. 
Overall the experience was great in that it only required me to log into the website to get at the data I needed. 
Recently the website started hiding that data behind a paywall. 
The goal of this project is to provide a way to still get at the data without paying. 

## Proprietary information
There is some key data that Steam does not expose that is useful, namely number of wishlists, revenue, followers, etc. 
What I've discovered is that this data can be _estimated_, keyword estimated. 
This is likely why other websites have put that data behind paywalls. They've had to develop algorithms to create useful estimations of these numbers. 
I will also explore developing some of these algorithms myself, and will always disclose when the data is exact and when data has been run through some estimation algorithm. 