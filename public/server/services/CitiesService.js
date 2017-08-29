/**
 * Created by Ljubica on 29.8.2017.
 */
var express = require('express')();
var cities = require("all-the-cities");

exports.getCities = function(){
    return JSON.parse(cities);
}

exports.getCity = function(name){
    return cities.filter(city=> {
        return city.name.match(name);
    })
}