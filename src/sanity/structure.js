import { LANGUAGES } from '../config/i18n';

export const structure = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Posts')
        .icon(() => '📝')
        .child(
          S.list()
            .title('Posts by Language')
            .items([
              S.listItem()
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
                  .title(`${lang.flag} ${lang.title}`)
                  .icon(() => lang.flag)
                  .child(
                    S.documentTypeList('post')
                      .title(`${lang.title} Posts`)
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
