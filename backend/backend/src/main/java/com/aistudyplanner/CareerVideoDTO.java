package com.aistudyplanner;

public class CareerVideoDTO {

    public String topic;
    public String title;
    public String url;
    public String channel;

    public CareerVideoDTO(
            String topic,
            String title,
            String url,
            String channel
    ) {
        this.topic = topic;
        this.title = title;
        this.url = url;
        this.channel = channel;
    }
}