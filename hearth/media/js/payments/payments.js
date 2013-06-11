define('payments/payments',
    ['capabilities', 'l10n', 'log', 'notification', 'requests', 'settings', 'urls', 'z'],
    function(caps, l10n, log, notification, requests, settings, urls, z) {

    var console = log('payments');

    var notify = notification.notification;
    var gettext = l10n.gettext;

    function waitForPayment($def, product, webpayJWT, contribStatusURL) {
        console.log('Waiting for payment confirmation');
        var checkFunc = function() {
            console.log('Fetching payment status from API...');
            requests.get(settings.api_url + urls.api.sign(contribStatusURL)).done(function(result) {
                console.log('Got payment status: ', result.status);
                if (result.status == 'complete') {
                    console.log('Payment complete. Resolving deferreds...');
                    $def.resolve(product);
                }
            }).fail(function(xhr, status, error) {
                console.error('Error fetching payment status: ', status, error);
                $def.reject(null, product, 'MKT_SERVER_ERROR');
            });
        };
        var checker = setInterval(checkFunc, 3000);
        var giveUp = setTimeout(function() {
            console.error('Payment took too long to complete. Rejecting.');
            $def.reject(null, product, 'MKT_INSTALL_ERROR');
        }, 60000);

        checkFunc();

        $def.always(function() {
            clearTimeout(checker);
            clearTimeout(giveUp);
        });
    }

    if (settings.simulate_nav_pay && !caps.navPay) {
        var console_mock = console.tagged('mock');
        navigator.mozPay = function(jwts) {
            var request = {
                onsuccess: function() {
                    console_mock.warning('handler did not define request.onsuccess');
                },
                onerror: function() {
                    console_mock.warning('handler did not define request.onerror');
                }
            };
            console_mock.log('STUB navigator.mozPay received', jwts);
            console_mock.log('calling onsuccess() in 3 seconds...');
            setTimeout(function() {
                console_mock.log('calling onsuccess()');
                request.onsuccess();
            }, 3000);
            return request;
        };
        console_mock.log('stubbed out navigator.mozPay()');
    }

    function beginPurchase(product) {
        if (!product) return;
        var $def = $.Deferred();

        console.log('Initiating transaction');

        if (caps.navPay || settings.simulate_nav_pay) {
            requests.post(urls.api.url('prepare_nav_pay'), {app: product.slug}).done(function(result) {
                console.log('Calling mozPay with JWT: ', result.webpayJWT);
                var request = navigator.mozPay([result.webpayJWT]);
                request.onsuccess = function() {
                    console.log('navigator.mozPay success');
                    waitForPayment($def, product, result.webpayJWT, result.contribStatusURL);
                };
                request.onerror = function(errorMsg) {
                    var msg;
                    console.error('`navigator.mozPay` error:', this.error.name);
                    switch (this.error.name) {
                        // Sent from webpay.
                        case 'cancelled':
                        // TODO: The following only works for en locale, remove this once
                        // DIALOG_CLOSED_BY_USER is sent by the device (Bug 879579).
                        case 'Dialog closed by the user':
                        // Sent from the trusted-ui on cancellation.
                        case 'DIALOG_CLOSED_BY_USER':
                            msg = gettext('Payment cancelled');
                            break;
                        default:
                            msg = gettext('Payment failed. Try again later.');
                            break;
                    }

                    notify({
                        classes: 'error',
                        message: msg,
                        timeout: 5000
                    });

                    $def.reject(null, product, 'MKT_CANCELLED');
                };
            }).fail(function(xhr, status, error) {
                console.error('Error fetching JWT from API: ', status, error);
                $def.reject(null, product, 'MKT_SERVER_ERROR');
            });

        } else {
            console.log('`navigator.mozPay` unavailable and mocking disabled. Cancelling.');
            $def.reject(null, product, 'MKT_CANCELLED');
        }

        return $def.promise();
    }

    return {
        'purchase': beginPurchase
    };
});
