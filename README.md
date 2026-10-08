# Aflah · Student technology portfolio

Live: https://aflahafi.github.io/personal-/

A lightweight, accessible portfolio built with semantic HTML, CSS and vanilla JavaScript. No package installation or build step is required.

## Edit

- `index.html`: biography, projects, skills, milestones and links.
- `style.css`: layout, colours, responsive breakpoints and reduced-motion styles.
- `script.js`: progressively enhanced mobile navigation and subtle section effects.
- `assets/`: optimized user-supplied portraits, original project concept illustrations, favicon and social preview.

Project visuals are illustrative concepts, not screenshots or photographs of the finished projects. Skills distinguish tools being used from topics being learned. No private application links, analytics or contact-form backend are included.

## Preview

From the parent directory run `python3 -m http.server 8000` and open `http://localhost:8000/personal-/`. This also tests the GitHub Pages project subdirectory. All runtime assets use relative paths.

## Deploy

The original repository has a single `master` branch; its root `index.html` matched the existing live GitHub Pages response before redesign. Continue publishing the root of `master` using the existing Pages configuration. `.nojekyll` marks the site as static. Commit and push changes normally; retain the existing history.

Photo sizes are supplied in WebP with JPEG fallbacks. Content and links remain usable without JavaScript. The mobile menu supports Escape and closes after navigation; animations respect reduced-motion preferences.
