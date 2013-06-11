define('views/app/ratings', ['l10n', 'urls'],
       function(l10n, urls) {

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];

        builder.start('ratings/main.html', {
            'slug': slug
        });

        builder.z('type', 'leaf');
        builder.z('reload_on_login', true);
        builder.z('reload_on_logout', true);
        builder.z('parent', urls.reverse('app', [slug]));
        // L10n: The title for the list of reviews
        builder.z('title', gettext('Reviews'));
    };
});
