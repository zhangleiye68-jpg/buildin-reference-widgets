# Upstream attribution and local adaptation

Calendar by httIsHere / Tina Huang, from [httIsHere/notion-widget](https://github.com/httIsHere/notion-widget), commit `b3adf7d2cad6069b753fbdb42a8dee189df13aa7`, retrieved 2026-11-03.

The calendar HTML is distributed under the upstream Apache License 2.0; see `LICENSE`. The bundled Klee One font retains its SIL Open Font License in `fonts/Klee_One/OFL.txt`.

Local changes: replace the global runtime and CryptoJS script dependencies with a small local compatibility script for plain `sw`, `dd`, and `black` query parameters. The upstream encrypted-configuration feature and global promotional UI are not included. The calendar's rendering, fixed 280-pixel width, month display, and date highlighting remain as upstream.

This entry is provided for reuse and comparison. For narrow columns and month navigation, prefer the self-authored Cozy calendar in `../../cozy-study/`.
