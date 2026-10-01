# Varconstint

A visual personal site for Henry (varconstint), built as static HTML, CSS, and JavaScript.

The profile picture is provided by Henry. The STEMSTAGE logo and stage artwork come from the [STEMSTAGE brand folder](https://github.com/SylarBeck/STEMSTAGE/tree/main/brand), and the gameplay image comes from the [repository screenshots](https://github.com/SylarBeck/STEMSTAGE/tree/main/docs/screenshots). The repository's MIT license is included at `assets/STEMSTAGE-LICENSE.txt`.

The animated hero background uses three.js 0.186.0 and the interface motion uses Anime.js 4.5.0. Pinned browser modules and their license files are stored in `assets/vendor/`. The site follows the system reduced-motion preference.

To preview locally, run `node preview.mjs` and open `http://localhost:4173`. Opening `index.html` directly as a file can block JavaScript module imports in browsers.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Choose your publishing branch and **/(root)**, then save.

The site has no build step or install step. All asset paths are relative, so it also works when GitHub Pages serves it from a repository subpath.
