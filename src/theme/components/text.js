import { defineStyle } from '@chakra-ui/react';
import { fontSizes } from '@/utils';

export const themeText = defineStyle({
    baseStyle: {
        color: 'var(--chakra-colors-gray3)',
        lineHeight: ['1.25'],
        fontWeight: '400',
    },
    defaultProps: {
        size: 'text16',
    },
    sizes: {
        'text70': defineStyle({
            fontSize: fontSizes.text70,
        }),
        'text60': defineStyle({
            fontSize: fontSizes.text60,
        }),
        'text40': defineStyle({
            fontSize: fontSizes.text40,
        }),
        'text30': defineStyle({
            fontSize: fontSizes.text30,
        }),
        'text20': defineStyle({
            fontSize: fontSizes.text20,
        }),
        'text16': defineStyle({
            fontSize: fontSizes.text16,
        }),
        'text14': defineStyle({
            fontSize: fontSizes.text14,
        }),
    }
});
