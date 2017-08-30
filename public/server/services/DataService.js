/**
 * Created by Ljubica on 30.8.2017.
 */
var express = require('express')();
var pcorr = require('compute-pcorr');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mapModel = require('../models/Map');
var map = mapModel.Map;

var pm10 = [];
var pm25 = [];
var red = [];
var orange = [];

exports.getMapData = function(){
   return new Promise(function (success, erros) {
      map.find({}).select('red orange pm10 pm25').exec(function (err, data) {
           if(err)
               erros(error);
          for(var i = 0; i<data.length; i++){
              var row = data[i];
            if(row.pm25 === null || row.pm10 === null)
                continue;
             pm25.push((row.pm25));
                  pm10.push((row.pm10));
                  red.push((row.red));
                  orange.push((row.orange));

          }

          var mat = pcorr(pm10, pm25, red, orange);
          console.log(mat);
       });
   });
}



