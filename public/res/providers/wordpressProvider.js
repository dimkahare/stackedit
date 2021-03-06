define([
    "underscore",
    "utils",
    "classes/Provider",
    "helpers/wordpressHelper"
], function(_, utils, Provider, wordpressHelper) {

    var wordpressProvider = new Provider("wordpress", "WordPress");
    wordpressProvider.defaultPublishFormat = "html";
    wordpressProvider.publishPreferencesInputIds = [
        "wordpress-site"
    ];

    wordpressProvider.publish = function(publishAttributes, frontMatter, title, content, callback) {
        var labelList = publishAttributes.tags || [];
        if(frontMatter) {
            frontMatter.tags !== undefined && (labelList = frontMatter.tags);
        }
        _.isString(labelList) && (labelList = _.compact(labelList.split(/[\s,]/)));
        wordpressHelper.upload(publishAttributes.site, publishAttributes.postId, labelList.join(','), title, content, function(error, postId) {
            if(error) {
                callback(error);
                return;
            }
            publishAttributes.postId = postId;
            callback();
        });
    };

    wordpressProvider.newPublishAttributes = function(event) {
        var publishAttributes = {};
        publishAttributes.site = utils.getInputTextValue("#input-publish-wordpress-site", event, /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/);
        publishAttributes.postId = utils.getInputTextValue("#input-publish-postid");
        if(event.isPropagationStopped()) {
            return undefined;
        }
        return publishAttributes;
    };

    return wordpressProvider;
});