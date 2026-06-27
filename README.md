# wontfallo.github.io

WontOS — a browser desktop with a built-in ESP32 web flasher, served via GitHub Pages.

## Structure

This site was previously a single self-unpacking `index.html` bundle (~280 KB, everything
inlined as base64). It's now split into normal static files:

```
index.html              The page: the dc-runtime component tree + app script
js/
  dc-runtime.js         The dc-runtime framework (loads React from unpkg, hydrates the page)
assets/
  *.png                 Board photos (C5, E3, S3 — front/back)
  fonts/
    jbmono-*.woff2      JetBrains Mono subsets
```

External dependencies are loaded at runtime from CDNs:

- React / ReactDOM — unpkg (pulled in by `js/dc-runtime.js`)
- esptool-js — jsdelivr/unpkg (web flasher)

Firmware images are fetched from the companion repo
[`Wontfallo/Wonthound`](https://github.com/Wontfallo/Wonthound).

## Local preview

Any static file server works, e.g.:

```
python -m http.server 8000
```

then open <http://localhost:8000>.

## Note on editing

`index.html` holds a compiled dc-runtime component tree, not hand-authored markup.
The readable app logic lives in the `<script type="text/x-dc">` block near the end of the
file. `js/dc-runtime.js` is generated ("do not edit") — don't modify it by hand.
