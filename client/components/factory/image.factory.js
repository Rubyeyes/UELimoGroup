angular.module('MyApp')
	.factory('Image', ['$http', 'Auth', 'Upload', function($http, Auth, Upload){
			var image = {};

			// upload on file select or drop
		    image.create = function (files, type, object) {
		    	for (var i = 0; i < files.length; i++) {
		    		Upload.upload({
			            url: '/api/' + type + '/' + object._id + '/image/upload',
			            data: {file: files[i]}
			        }).then(function (resp) {
			            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
			        }, function (resp) {
			            console.log('Error status: ' + resp.status);
			        }, function (evt) {
			            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
			            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
			        });
		    	}
		    };

			//remove a fleet
			image.delete = function(type, object) {
				return $http.delete('/api/' + type + '/' + object._id + '/image/delete', {
					headers: {Authorization: 'Bearer '+ Auth.getToken()}
				})
			}; 
				

			return image;
		}])