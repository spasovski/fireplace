define('views/feed/collection',
    ['l10n', 'utils'],
    function(l10n, utils) {
    'use strict';
    var gettext = l10n.gettext;

    var entities = {
        '&amp;': '&',
        '&copy;': '©',
        '&trade;': '™',
        '&deg;': '°'
    };

    function replaceEntities(str) {
        for (var key in entities) {
            str = str.replace(key, entities[key]);
        }
        return str;
    }

    return function(builder, args) {
        builder.z('type', 'leaf');
        builder.z('title', gettext('Loading...'));

        var slug = args[0];
        builder.start('feed/collection.html', {
            slug: slug
        });

        builder.onload('feed-collection', function(data) {
            builder.z('title', replaceEntities(utils.translate(data.name)));
        });
    };
});
