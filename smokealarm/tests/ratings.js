var suite = require('./kasperle').suite();

suite.run('/', function(test, waitFor) {

    waitFor(function() {
        return suite.exists('#splash-overlay.hide');
    });

    test('Click on featured app', function() {
        suite.press('.featured ul li a:first-child');
    });

    waitFor(function() {
        // Wait for reviews to load in.
        return suite.exists('#reviews-detail ul, #reviews-detail p.not-rated');
    });

    test('Click on reviews button', function() {
        suite.press('#reviews-detail .average-rating');
    });

    waitFor(function() {
        // Wait for reviews list.
        return suite.exists('#review-list');
    });

    test('Click on report review', function() {
        suite.press('#review-list .actions a');
    });

    test('Ratings page baseline tests', function(assert) {
        assert.URL(/\/app\/[a-zA-Z0-9]+\/ratings/);

        assert.hasText('#write-review');

        assert.visible('#flag-review');
        assert.selectorExists('#flag-review ul li a');

        // Once this is finalized we should test the report review API call
        // and other parts of the review listing page.

        suite.capture('ratings.png');
    });
});
