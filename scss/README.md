# SCSS source organization

The ready-to-publish site uses `../css/styles.css` directly and does not require Sass. If you want to develop with SCSS, split styles into partials such as `_tokens.scss`, `_layout.scss`, `_components.scss`, and `_responsive.scss`, then compile the entry file into `../css/styles.css`. The root `index.html` always links to the compiled vanilla CSS file.
