define('ContactUs.View', [
    'contact_us.tpl',
    'Backbone.FormView',
    'jQuery',
    'Backbone',
    'underscore',
    'Utils'
], function ContactUsView(
    contactUsTpl,
    BackboneFormView,
    jQuery,
    Backbone,
    _
) {
    'use strict';

    // @class ContactUs.View @extends Backbone.View
    return Backbone.View.extend({

        template: contactUsTpl,
        title: _('Contact us').translate(),
        page_header: _('Contact us').translate(),

        events: {
            'submit form': 'saveTheForm'
        },

        bindings: {
            '[name="firstname"]': 'firstname',
            '[name="lastname"]': 'lastname',
            '[name="email"]': 'email',
            '[name="title"]': 'title',
            '[name="incomingmessage"]': 'incomingmessage'
        },
        attributes: {
            'class': 'contact-us'
        },

        getBreadcrumbPages: function getBreadcrumbPages() {
            return [{
                text: _('Contact Us').translate(),
                href: '/contact-us'
            }];
        },

        initialize: function initialize(options) {
            this.options = options;
            this.application = options.application;
            this.model.on('sync', jQuery.proxy(this, 'showSuccess'));

            BackboneFormView.add(this);
        },

        // Prevents not desired behaviour when hitting enter
        preventEnter: function preventEnter(event) {
            if (event.keyCode === 13) {
                event.preventDefault();
            }
        },

        saveTheForm: function saveTheForm(e) {
            var self = this;
            var promise = BackboneFormView.saveForm.apply(this, arguments);

            e.preventDefault();

            return promise && promise.then(function promiseSuccessCallback(data) {
                if (data.successMessage) {
                    self.showMessage(data.successMessage, 'success');
                    self.$('form').get(0).reset();
                } else {
                    self.showMessage('Error occurred, please try again.', 'error');
                }
            }, function promiseErrorCallback(jqXhr) {
                jqXhr.preventDefault = true;
                self.showMessage(jqXhr.responseJSON.errorMessage, 'error');
            });
        },

        showMessage: function showMessage(message, type) {
            var $message = this.$('.message').removeClass('hide message-success message-error');
            if (type === 'success') {
                $message.addClass('message-success');
            } else {
                $message.addClass('message-error');
            }
            $message.text(message).fadeIn(400).delay(3000).fadeOut();
        },

        getContext: function getContext() {
            // @class ContactUs.View.Context
            return {
                // @property {String} pageHeader
                pageHeader: this.page_header
            };
        }
    });
});
