import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Menu,
    MenuButton,
    Flex,
    Text,
    MenuList,
    MenuItem,
    Box,
    Button,
    useBreakpointValue,
    Spinner
} from '@chakra-ui/react';
import ChevronDownIcon from '@/icons/chevron-down';
import { useAppDispatch, useAppSelector } from '@/store';
import useUpdateProfileApi from '@/hooks/useUpdateProfileApi';
import DotIcon from '@/icons/dot';
import LanguageSwitcherIcon from '@/icons/language-switcher';
import { styler_menu } from '@/components/common/Styler';
import { setLang } from '@/utils';
import { clearLangBasedApiCache } from '@/store/thunks/redirects';
import { useGetPlatformsQuery } from '@/store/service/accounts';
import { clearAllApiCache } from '@/store/thunks';

export function LanguageMenu() {

    const dispatch = useAppDispatch();
    const { i18n } = useTranslation();
    const { data: platform } = useGetPlatformsQuery();
    const languages = useMemo(() => platform?.locales, [ platform ]);
    const { language } = useAppSelector((state) => state.accounts.currentAccount);
    const [ updateProfile, { isLoading } ] = useUpdateProfileApi();

    const selectedLanguage = useMemo(() => languages?.find((item) => {
        // eq current account language or i18n language
        // console.log('i18n', account, i18n.language);
        return item.value === language || item.value === i18n.language;
    }), [ language, languages, i18n.language ]);

    const handleLanguageChange = useCallback((lang) => {
        i18n.changeLanguage(lang);
        setLang(lang);
        dispatch(clearLangBasedApiCache());
        updateProfile({ field: 'language', value: lang });
        // clean all API cache to avoid language based cache
        dispatch(clearAllApiCache());
    }, [ i18n, dispatch, updateProfile ]);

    const responsive = useBreakpointValue({
        base: {
            display: 'none'
        },
        md: {
            display: 'inline-flex'
        }
    });

    const styler = {
        px: { base: 2.5, md: 3.5 },
        mr: { base: 2, lg: 6, xl: 10 },
        py: { base: 1, md: 2 },
        borderColor: 'gray.300',
        _hover: { backgroundColor: 'gray.100' },
        _active: { backgroundColor: 'gray.100' },
        height: { base: '30px', md: '40px' },
    };

    const styler_text = {
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '20px',
        as: 'span',
    };

    return (
        <Menu placement="top-end" isLazy>
            <MenuButton as={Button} {...styler}>
                <Flex alignItems="center">
                    {isLoading ?
                        <Spinner size='sm' color='gray.500' /> :
                        <LanguageSwitcherIcon w={5} h={5} fontWeight={500} color="gray.500" />
                    }
                    <Text
                        ml={{ base: 0, md: 2 }}
                        fontSize={{ base: '14px', md: '16px' }}
                        fontWeight={500}
                        color="gray.500"
                        {...responsive}
                    >
                        {selectedLanguage?.text}
                    </Text>
                    <ChevronDownIcon ml={1.5} w={5} h={5} color="gray.500" {...responsive} />
                </Flex>
            </MenuButton>
            <MenuList p={2} minW={'fit-content'} zIndex={999}>
                {languages?.map((lang) => (
                    <MenuItem
                        key={lang.value}
                        onClick={() => handleLanguageChange(lang.value)}
                        {...styler_menu}
                        borderRadius={'8px'}
                    >
                        <DotIcon mr={3} size='2' color='primary' />
                        <Box {...styler_text}>
                            {lang.text}
                        </Box>
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}

