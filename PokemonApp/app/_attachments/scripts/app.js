'use strict'

angular.module('movieApp', ['ngRoute'])

	.config(function($routeProvider) {
	    $routeProvider
	        .when('/home', {
	            templateUrl: 'assets/views/home.html',
	            controller: 'homeCtrl'
	        })
	        .otherwise({redirectTo:'/home'});
	})
	
	.controller('homeCtrl', function($scope, movieSrv, saveSrv) {
	
		

	    	$('#searchButton').on('click', function(e) {
	    		$scope.movies = '';
	    		var actor = $('#actorText').val().toLowerCase();
	    		
	    		saveSrv.getObject(actor).then(function(data){
	    			//console.log(data);
	    			$scope.movies = data.movies;
	    		}, function(err){
	    			movieSrv.getMovies(actor).then(function(data){
		    			//console.log(data);
		    			$scope.movies = data;
		    			var doc = {};
		    			doc.actor = actor;
		    			doc.movies = data;
		    			//console.log(doc);
		    			saveSrv.setObject(actor, doc);
		    		}, function(err) { 
		    			alert('Actor not found');
		    		});
	    		});
	    	});
    })
   
    .service('movieSrv', function($http, $q) {
    		this.getMovies = function(actor) {
	    		var q = $q.defer();
	    		var url = 'http://theimdbapi.org/api/find/person?name=' + encodeURIComponent(actor);
	    		//console.log(url);

	    		$http.get(url)
	    			.then(function(data){
	    				var movieObjects = data.data[0].filmography.actor;
	    				//console.log(movieObjects);
	    				var movies = [];
	    				for (var i = 0; i < movieObjects.length; i++) {
	    					//console.log(movieObjects[i].title);
	    					movies.push(movieObjects[i].title);
	    				}
	    				
	    				q.resolve(movies);
	    			}, function(err) {
	    				q.reject(err);
	    			});
	    			
	    			return q.promise;
	    		};
    })

    .service('saveSrv', function($http, $q){
		  this.setObject = function(key, value){
			  $http.put('../../' + key, value);
		  };
		  
		  this.getObject = function(key){
			  var q = $q.defer();
			  $http.get('../../' + key)
	  			.then(function(data){
	  				q.resolve(data.data);
	  			}, function(err) {
	  				q.reject(err);
	  			});
  			
  			  return q.promise;
		  };
	});