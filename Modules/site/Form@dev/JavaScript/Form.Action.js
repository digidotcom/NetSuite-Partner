define('Form.Action', [
    'underscore'
], function FormActionModule(
    _
) {
    'use strict';

    function FormAction(options) {
        this.view = options.view;
        this.action = options.action;
        this.application = options.application;
        this.config = options.config;
    }

    _(FormAction.prototype).extend({
        run: function run() {
            var getActionPromise = this.config.getData().actionPromiseCallback;
            getActionPromise({
                action: this.action,
                model: this.config.model
            });
        }
    });

    return FormAction;
});
