//This  JS serves data from local json files as it would came from a server

var falserver = (function() {
    "use strict";
    var falserver = {};
    falserver.getAllPost = function() {
        jQuery.get('/all-posts.json', function(data) {
            return data;
        }, function() {
            displayErrorMessage("Error occurred, please contact the administrator!");
        });
    };

    falserver.getPostById = function(id) {
        var allPosts = JSON.parse(falserver.getAllPost())
        return allPosts.find(function(post) {
           return post.path === id;
        });
    };

    falserver.getRecent = function (callback) {
        jQuery.getJSON('/recent.json', function(data) {
            callback(data);
        }).error(function() {
            displayErrorMessage("Error occurred, please contact the administrator!");
        });
    };

    return falserver;
}());
