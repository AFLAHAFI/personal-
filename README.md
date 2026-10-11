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

## Portfolio features (October 2026)

- `projects/herbiq.html`, `projects/kerala-routes.html`, `projects/sky-runner.html`: static case studies with real project screenshots, contribution, features, challenges and lessons.
- `features.js`: project category filters, three-record plant explorer, Ctrl/Cmd+K command menu, saved theme controls and heading-line animation.
- `features.css`: responsive layouts, light-theme overrides, dialog, demo and case-study presentation.
- `theme.js`: early saved-theme restoration; storage failures fall back to dark mode.

The project screenshots show the public HerbiQ companion site, Kerala Routes welcome screen and a Sky Runner gameplay image published on its itch.io page. HerbiQ's WRO Silver Badge is credited to Team Delta Malabar. The plant explorer is a small educational UI demo, with local sample data and no server or camera requirement.

Keyboard controls: Ctrl/Cmd+K opens search; type to filter; arrow keys move through results; Enter opens a result; Escape closes the dialog. A visible Search button provides the same function on mobile. Themes persist when local storage is available. Project content and links remain available without JavaScript.
