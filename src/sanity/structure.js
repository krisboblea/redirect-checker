import { LANGUAGES } from '../config/i18n';

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .id('posts-root')
        .title('Posts')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Posts by Language')
            .items([
              S.listItem()
                .id('posts-all')
                .title('All Posts')
                .icon(() => '🌐')
                .child(
                  S.documentTypeList('post')
                    .title('All Posts')
                    .filter('_type == "post"')
                ),
              S.divider(),
              ...LANGUAGES.map((lang) =>
                S.listItem()
                  .id(`posts-${lang.id}`)
                  .title(`${lang.flag} ${lang.nativeName || lang.title}`)
                  .icon(() => lang.flag)
                  .child(
                    S.documentTypeList('post')
                      .title(`${lang.nativeName || lang.title} Posts`)
                      .filter('_type == "post" && locale == $locale')
                      .params({ locale: lang.id })
                      .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                  )
              ),
            ])
        ),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => listItem.getId() !== 'post'
      ),
    ])
