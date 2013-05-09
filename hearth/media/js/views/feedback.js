define('views/feedback',
       ['buckets', 'capabilities', 'forms', 'l10n', 'notification', 'requests', 'z'],
       function(buckets, caps, forms, l10n, notification, requests, z) {

    var gettext = l10n.gettext;
    var notify = notification.notification;
    var nunjucks = require('templates');
    var urls = require('urls');
    var utils = require('utils');

    z.page.on('submit', '.feedback-form', function(e) {
        e.preventDefault();

        var $this = $(this);
        var data = utils.getVars($this.serialize());
        data.chromeless = caps.chromeless ? 'Yes' : 'No';
        data.from_url = window.location.pathname;
        data.profile = buckets.get_profile();

        forms.toggleSubmitFormState($this);

        requests.post(urls.api.url('feedback'), data).done(function(data) {
            $this.find('textarea').val('');
            notify({message: gettext('Feedback submitted. Thanks!')});
        }).fail(function() {
            forms.toggleSubmitFormState($this, true);
            notify({
                message: gettext('There was a problem submitting your feedback. Try again soon.')
            });
        });
    });

    // Init desktop feedback form modal trigger.
    // The modal is responsive even if this handler isn't removed.
    if (caps.widescreen) {
        z.page.on('loaded', function() {
            z.page.append(
                nunjucks.env.getTemplate('settings/feedback.html').render(require('helpers'))
            );
        });
        z.body.on('click', '.submit-feedback', function(e) {
            e.preventDefault();
            e.stopPropagation();
            z.body.trigger('decloak');
            $('.feedback.modal').addClass('show');
        });
    }

    return function(builder, args) {
        builder.start('settings/feedback.html').done(function() {
            $('.feedback').removeClass('modal');
        });

        builder.z('type', 'leaf');
        builder.z('title', gettext('Feedback'));
    };
});
