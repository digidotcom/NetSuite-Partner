define('ContactUs', [
    'ContactUs.Router'
], function ContactUs(
    Router
) {
    'use strict';

    return {
        mountToApp: function mountToApp(application) {
            return new Router(application);
        }
    };
});
