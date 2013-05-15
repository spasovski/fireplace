define('views/app/ratings/add',
    ['login', 'l10n', 'urls', 'user', 'z'],
    function(login, l10n, urls, user, z) {

    var gettext = l10n.gettext;

    return function(builder, args) {
        var slug = args[0];

        // If the user isn't logged in, redirect them to the detail page and
        // open a login window. If they complete the login, click the Write
        // Review button if it exists.
        if (!user.logged_in()) {
            login.login().done(function() {
                $('#add-review').trigger('click');
            });
            return;
        }

        builder.start('ratings/write.html', {'slug': slug}).done(function() {
            var $reviewBox = $('.compose-review');

            $reviewBox.removeClass('modal');
            $reviewBox.find('.cancel').on('click', function() {
                z.page.trigger('navigate', urls.reverse('app', [slug]));
            });

            // Scroll the page down to make the send/cancel buttons visible.
            $reviewBox.find('.rating').on('click touchend', function() {
                $reviewBox.find('textarea')[0].focus();
            });
            if (scrollTo) {
                $reviewBox.find('textarea').on('focus', function() {
                    setTimeout(function() {window.scrollTo(0, 200);}, 350);
                });
            }
        });

        builder.z('type', 'leaf');
        builder.z('parent', urls.reverse('app/ratings', [slug]));
        builder.z('title', gettext('Write a Review'));
    };
});
