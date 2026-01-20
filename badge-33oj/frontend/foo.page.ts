import { $, addPage, NamedPage, UserSelectAutoComplete } from '@hydrooj/ui-default'


addPage(new NamedPage(['badge_create'], () => {
    UserSelectAutoComplete.getOrConstruct($('[name="uidOrName"]'), {
        clearDefaultValue: false,
    });
}));
