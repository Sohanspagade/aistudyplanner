package com.aistudyplanner;

import java.util.List;

public class Student {

    private String name;
    private List<String> subjects;
    private int hoursPerDay;
    private String examDate; // ✅ ADD THIS

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getSubjects() {
        return subjects;
    }

    public void setSubjects(List<String> subjects) {
        this.subjects = subjects;
    }

    public int getHoursPerDay() {
        return hoursPerDay;
    }

    public void setHoursPerDay(int hoursPerDay) {
        this.hoursPerDay = hoursPerDay;
    }

    // ✅ ADD THESE
    public String getExamDate() {
        return examDate;
    }

    public void setExamDate(String examDate) {
        this.examDate = examDate;
    }
}