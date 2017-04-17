define('OrderWizard.Module.PaymentMethod.GiftCertificates.Fixes', [
    'OrderWizard.Module.PaymentMethod.GiftCertificates',
    'GlobalViews.Confirmation.View',
    'underscore',
    'jQuery'
], function OrderWizardGiftCertificateFixes(
    Wizard,
    GlobalViewsConfirmationView,
    _,
    jQuery
) {
    'use strict';

    _(Wizard.prototype).extend({
        removeGiftCertificate: function removeGiftCertificate(e) {
            var deleteConfirmationView;
            var code = jQuery(e.target).data('id');
            var isApplied = _.find(this.giftCertificates, function findPayment(paymentMethod) {
                // the fix is here. Code is sometimes a string, sometimes an integer
                return (paymentMethod.get('giftcertificate').code + '') === (code + '');
            });

            if (isApplied) {
                deleteConfirmationView = new GlobalViewsConfirmationView({
                    callBack: this._removeGiftCertificate,
                    callBackParameters: {
                        context: this,
                        code: code
                    },
                    title: _('Remove Gift certificate').translate(),
                    body: _('Are you sure you want to remove this Gift certificate?').translate(),
                    autohide: true
                });

                this.wizard.application.getLayout().showInModal(deleteConfirmationView);
            }
        }
    });
});
