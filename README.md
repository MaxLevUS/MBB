# Minnesota Bridal Beauty — Production Website

A static, GitHub Pages-ready bridal hair and makeup website.

## Project structure

```text
index.html
assets/
  css/styles.css
  js/main.js
  images/
    hero/bridal-party-hero.jpg
    portfolio/
  icons/favicon.svg
robots.txt
sitemap.xml
site.webmanifest
.nojekyll
CNAME.example
```

## Before publishing

1. Replace every occurrence of `YOUR-DOMAIN.com` in:
   - `index.html`
   - `robots.txt`
   - `sitemap.xml`
   - `CNAME.example`
2. Review or replace the included hero image at:
   - `assets/images/hero/bridal-party-hero.jpg`
3. Confirm the Formspree endpoint:
   - `https://formspree.io/f/xqerneod`
4. Verify the business email:
   - `MakeupMinnesota@gmail.com`
5. Review service pricing and portfolio images.

## GitHub Pages

1. Create a public GitHub repository.
2. Upload all files and folders to the repository root.
3. Open **Settings → Pages**.
4. Choose:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/ (root)`
5. Save.

## Custom domain later

1. Rename `CNAME.example` to `CNAME`.
2. Put only the final domain in the file.
3. Configure DNS with the registrar.
4. Add the same domain under **Settings → Pages → Custom domain**.
5. Enable **Enforce HTTPS** after validation.

## SEO included

- Optimized page title and meta description
- Open Graph and Twitter metadata
- Canonical URL placeholder
- Local business structured data
- `robots.txt`
- `sitemap.xml`
- Descriptive image alt text
- Semantic headings
- Mobile responsiveness
- Accessible form labels and keyboard focus
- Lazy-loaded portfolio images
- Web app manifest and favicon

## Notes

The hero and portfolio images are stored locally, so the published site does not depend on external image URLs.
