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
            stored[post.id] = post;
            store.set(conf.key, stored);
        } else {
            var arr = visit.getAll();
            if (arr.length === conf.maxStore) {
                delete stored[arr.reverse()[0].id];
            }
            if (stored[post.id]) {
                delete stored[post.id];
            }
            stored[post.id] = post;
            store.set(conf.key, stored);

        }
    };

    visit.clear = function (elem) {
        var stored = store.get(conf.key);
        delete stored[jQuery(elem).attr('parent-id')];
        store.set(conf.key, stored);
    };

    visit.renderIndex = function () {
        render(null, "/templates/viewed_index.html");
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
            container.html('');
            if (!limit) {
                if (visitedPosts.length > conf.limit) {
                    more.show()
                } else {
                    more.hide();
                }
                container.loadTemplate(template, visitedPosts.reverse().splice(0, conf.limit));
            } else {
                container.loadTemplate(template, visitedPosts.reverse());
                more.hide();
            }
        } else {
            outerContainer.hide();
        }
    }

    function getPageObject() {
        return {
            id :  window.location.pathname,
            title: jQuery("#title").text(),
            date: jQuery("#date").text(),
            visited: new Date(),
            category: jQuery("#category").text().split(' ')[0]
        }
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
        var recentContainer = jQuery("#recent-container");
        var recentArr =  jQuery.map(posts , function (value) {
            return value;
        });
        recentContainer.html("");
        recentContainer.loadTemplate("/templates/recent.html", recentArr);
        jQuery("#recent-more").hide();
    });
}

