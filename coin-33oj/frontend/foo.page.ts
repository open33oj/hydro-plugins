import { $, addPage, NamedPage, UserSelectAutoComplete } from '@hydrooj/ui-default'


addPage(new NamedPage(['coin_inc'], () => {
    UserSelectAutoComplete.getOrConstruct($('[name="uidOrName"]'), {
        clearDefaultValue: false,
    });
}));
