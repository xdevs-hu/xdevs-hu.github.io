var visit = (function(){
    "use strict";

    var conf = {
        key: "visited",
        limit: 4,
        maxStore: 9
    };

    var visit = {};

    visit.getAll = function () {
        var map = store.get(conf.key);
        if (map) {
             return jQuery.map(map , function (value) {
                return value;
            });
        }
    };

    visit.visit = function () {
        var stored = store.get(conf.key);
        var post = getPageObject();
        if (!stored) {
            stored = {};
            stored[post.url] = post;
            store.set(conf.key, stored);
        } else {
            var arr = visit.getAll();
            if (arr.length === conf.maxStore) {
                delete stored[arr.reverse()[0].url];
            }
            if (stored[post.url]) {
                delete stored[post.url];
            }
            stored[post.url] = post;
            store.set(conf.key, stored);
        }
    };

    visit.clear = function (removeButton, e, callback) {
        e.stopPropagation();
        var stored = store.get(conf.key);
        var itemUrl = jQuery(removeButton).attr('parent-id');
        var elem = jQuery("div[target='"  + itemUrl + "']")[0];
        if (elem) {
            delete stored[itemUrl];
            store.set(conf.key, stored);
            jQuery(elem).fadeOut(400, function () {
                jQuery(elem).remove();
                if (callback) {
                    callback();
                }
            });
        }
    };

    visit.renderIndex = function (animated) {
        var template = "/templates/viewed_index.html";
        var container = jQuery("#viewed-container");
        var outerContainer = jQuery("#viewed-outer-container");
        var more = jQuery("#viewed-more");
        var visitedPosts = visit.getAll();
        if (visitedPosts && visitedPosts.length > 0) {
            outerContainer.show();
            container.loadTemplate(template, visitedPosts.reverse(), {success: function () {
                if (animated) {
                    outerContainer.css('height', 'auto');
                    var fullHeight = outerContainer.height();
                    outerContainer.height(0);
                    outerContainer.animate({height: fullHeight},
                        500,
                        function () {
                            outerContainer.css({height: ''});
                        }
                    );                }
            }});
        } else {
            outerContainer.hide();
        }
    };

    visit.renderPost = function (limit) {
        render(limit, "/templates/viewed.html");
    };

    function render(limit, template) {
        var container = jQuery("#viewed-container");
        var outerContainer = jQuery("#viewed-outer-container");
        var more = jQuery("#viewed-more");
        var visitedPosts = visit.getAll();
        if (visitedPosts && visitedPosts.length > 0) {
            outerContainer.show();
            if (!limit) {
                if (visitedPosts.length > conf.limit) {
                    more.show()
                } else {
                    more.addClass("animated fadeOut");
                }
                container.loadTemplate(template, visitedPosts.reverse().splice(0, conf.limit));
            } else {
                container.show();
                var originalHeight = outerContainer.height();
                container.loadTemplate(template, visitedPosts.reverse());
                outerContainer.css('height', 'auto');
                var fullHeight = outerContainer.height();
                outerContainer.height(originalHeight);
                more.addClass("animated fadeOut");
                outerContainer.animate({height: fullHeight},
                    500,
                    function () {
                        outerContainer.height('height', '');
                    }
                );
            }
        } else {
            outerContainer.hide();
        }
    }

    function getPageObject() {
        return {
            id: getNextValId(window.location.pathname),
            url :  window.location.pathname,
            title: jQuery("#title").text(),
            date: jQuery("#date").text(),
            visited: new Date(),
            category: jQuery("#category").text().trim().split(" ")[0]
        }
    }

    function getNextValId(urlIn) {
        var map = store.get(conf.key);
        var arr = visit.getAll();
        var result = 1;
        if (arr) {
            if (!map[urlIn]) {
                for (var i = 0; i < conf.limit; i++) {
                    if (!arr[i]) {
                        result = i+1;
                    }
                }
            } else {
                result = map[urlIn].id;
            }
        }
        return result;
    }

    return visit;
}());


falserver.getRecent(function(posts) {
    var recentArr =  jQuery.map(posts , function (value) {
        return value;
    });
    jQuery("#recent-container").loadTemplate("/templates/recent.html", recentArr.splice(0,4));
});

function moreRecent() {
    falserver.getRecent(function(posts) {
        var outerContainer = jQuery("#recent-outer-container");
        var recentContainer = jQuery("#recent-container");
        var recentArr =  jQuery.map(posts , function (value) {
            return value;
        });
        var originalHeight = outerContainer.height();
        recentContainer.loadTemplate("/templates/recent.html", recentArr);
        outerContainer.css('height', 'auto');
        var fullHeight = outerContainer.height();
        outerContainer.height(originalHeight);
        jQuery("#recent-more").addClass("animated fadeOut");
        outerContainer.animate({height: fullHeight}, 500);
    });
}

