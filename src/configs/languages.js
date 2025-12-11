import { LANGUAGES as LANG_CONFIG } from '../config/i18n';

export const LANGUAGES = LANG_CONFIG.map(lang => ({
    value: lang.id,
    text: lang.title
}));