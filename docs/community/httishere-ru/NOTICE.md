# Upstream notices and modifications

The HTML adapters, `global.js`, and `flexibleMerge.js` derive from Tina Huang / httIsHere's [notion-widget](https://github.com/httIsHere/notion-widget), Apache-2.0, repository revision `b3adf7d2cad6069b753fbdb42a8dee189df13aa7`. Copyright and source headers are retained. The adjacent `LICENSE` contains the upstream Apache license.

Changes dated 2026-11-06: Russian interface labels; display-only `ru_name`, `ru_text`, and `ru_tasks` overrides; local script references; removal of configuration console logging; blue-week default-color guard; responsive safeguards. Original date calculations, relative-date rounding, configured dates, theme/week settings, flip animation, and carousel timing remain in the derived pages. No browser storage or database connection is added.

`i18n.js` is independently authored for this library. Public frontend `e` configuration compatibility is retained; its published interoperability material is not an account credential. Private instance configurations are never included in these files or previews.

Bundled dependencies retain their own licenses:

- CryptoJS: MIT, `CryptoJS-LICENSE`.
- jQuery 3.6.0: MIT, `jQuery-LICENSE`.
- Vue 2.6.14: MIT, `Vue-LICENSE`.
- Swiper 7.0.8: MIT, `Swiper-LICENSE`.

Fonts and photographs are referenced from the author's existing public HTTPS assets, rather than redistributed. Icons8 quote images remain remote references. Each source page's asset URLs identify their origin. Availability of those external decorative assets is a separate dependency from the local script and calculation functionality.
