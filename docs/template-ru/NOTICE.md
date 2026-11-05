# Implementation and compatibility sources

Rendering, Russian labels, timer state, responsive layouts and WebCrypto interoperability code in this directory are independently authored for this component library. They may be reused with the library's self-authored components.

The legacy behavior and public configuration format were inspected from [httIsHere / Tina Huang's notion-widget repository](https://github.com/httIsHere/notion-widget), whose root [LICENSE](https://github.com/httIsHere/notion-widget/blob/main/LICENSE) is Apache-2.0. This adaptation retains the relevant original date, reset, week-start and configured-value semantics. The optional public `e` configuration format is AES-ECB with PKCS7 padding. Its frontend interoperability key is public protocol material, not an account credential. The implementation here uses only standard WebCrypto AES-CBC operations and parses the decrypted data as JSON; it does not evaluate or execute configuration strings.

No implementation from the separately hosted greeting-clock reference is copied. The greeting, date and live clock are rendered by the new independent component.

The background calendar references `https://httishere.github.io/notion-widget/assets/snow.jpeg`. Configured countdown images reference the author's existing `assets/days-card/` HTTPS paths. Those original image files are not redistributed in this directory. The generic component previews contain no private template values or personal event configuration.
