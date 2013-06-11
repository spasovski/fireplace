define('views/app/purchases',
       ['l10n', 'login', 'urls', 'user', 'z'],
       function(l10n, login, urls, user, z) {

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];

        // If the user isn't logged in, redirect them to the detail page.
        if (!user.logged_in()) {
            z.page.trigger('navigate', urls.reverse('app', [slug]));
            return;
        }

        builder.start('detail/purchases.html', {slug: args[0]});

        builder.z('type', 'root');
        builder.z('parent', urls.reverse('app', [args[0]]));
        builder.z('reload_on_login', true);
        builder.z('title', gettext('Purchases'));
    };
});
