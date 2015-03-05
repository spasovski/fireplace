/*
    Error codes and their associated messages.
*/
define('error_messages', ['core/l10n'], function(l10n) {
    'use strict';
    var gettext = l10n.gettext;

    return {
        app_missing: {
            title: gettext('App Not Found'),
            message: gettext('We could not load that app. Please try again later.')
        },
        collection_missing: {
            title: gettext('Collection Not Found'),
            message: gettext('We could not load that collection. Please try again later.')
        },
        editorial_missing: {
            title: gettext('Editorial Brand Not Found'),
            message: gettext('We could not load that editorial brand. Please try again later.')
        },
        shelf_missing: {
            title: gettext('Operator Shelf Not Found'),
            message: gettext('We could not load that operator shelf. Please try again later.')
        }
    };
});
