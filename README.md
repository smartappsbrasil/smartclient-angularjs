# S.M.A.R.T Connect

A library to help developers integrate your solutions created with angularjs on SMARTAPPS plataform.

You need load smart module with angular, like this: <b>angular.module('todoApp', ['smart'])</b>

## Basic usage:

### Get data
SMARTAPI.getData('form[/args]')->then(function(res){});

## Send data (exec method)
SMARTAPI.execMethod('[post/get]', method_name, params)

To get more info about methods and args that you can use, check the S.D.K API docs.

@note The autentication is checked when you try connect on plataform.

@author José Wilker <jose.wilker@smartapps.com.br>

