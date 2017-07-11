define('NavigationTabsDisplay.Configuration', [
    'Models.Init'
], function NavigationTabsDisplayConfiguration(
    ModelsInit
) {
    'use strict';

    return {
        tabs: {
            PQR: 'PQR',
            REGISTRATIONS: 'Registrations',
            QUOTES: 'Quotes',
            DOCUMENTS: 'Documents',
            KNOWLEDGE: 'Knowledge',
            SETTINGS: 'Settings',
            CASES: 'Cases'
        },
        role: {
            internalId: parseInt(ModelsInit.context.getRole(), 10),
            scriptId: ModelsInit.context.getRoleId()
        },

        getForBootstrapping: function getForBootstrapping() {
            return {
                tabs: this.tabs,
                role: this.role
            };
        }
    };
});
