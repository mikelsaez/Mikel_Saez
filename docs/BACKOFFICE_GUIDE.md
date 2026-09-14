# Backoffice editor guide

This guide covers routine content maintenance for the Mikel Saez de Vicuña portfolio. No code editing is required for the workflows below.

## Sign in

1. Open `https://saezdevicuna.eus/admin/`.
2. Select **Login with Netlify Identity**.
3. Use an individually invited editor account.

Credentials and shared passwords must never be committed to the repository or pasted into content fields.

## Test the public site and backoffice locally

From the repository root, install the locked dependencies once and start both local services:

```bash
npm ci
npm run dev:local
```

Open these addresses:

- Public site: `http://localhost:5173/en/`, `http://localhost:5173/es/` and `http://localhost:5173/eu/`
- Backoffice: `http://localhost:5173/admin/`

Select **Login** in the local backoffice. Local mode requires no Netlify credentials and the proxy is reachable only from the same computer. Because Decap's local file-system backend supports only simple publishing, the production editorial workflow is disabled only on localhost.

A local save immediately updates the corresponding repository files instead of creating a draft. Review `git diff`, check all three public routes and run `npm run check` before keeping an edit. Press `Ctrl+C` in the service terminal to stop both the site and CMS proxy.

## Edit translated website copy

1. Open **Website translations**.
2. Open **Website copy**.
3. Select the required locale tab: English, Español or Euskara.
4. Edit the relevant section.
5. Review all three locale tabs before publishing.
6. Save the entry as a draft and use its Netlify deploy preview for a visual check.
7. Move it to **Ready** and select **Publish** only after the preview passes review.

All fields are independently editable in every language, including navigation labels, accessibility text, SEO metadata, page sections, expertise cards and project descriptions.

Some headings allow two formatting tags:

- `<em>text</em>` for the gold italic phrase
- `<br />` for an intentional line break

Do not enter any other HTML. The build rejects unsupported markup.

## Update links or shared media

Open **Shared settings → Shared site settings**.

- **About portrait** changes the portrait in all languages.
- **Contact links** changes the email or LinkedIn destination in all languages.
- **Partner logos** controls the image, organization name and display size.

Use clear organization names for logo alt text. Upload JPEG, PNG, WebP or SVG assets that are optimized for the web and smaller than 5 MB.

## Add a map project

A map project has shared technical data and three localized descriptions. Both parts are required.

1. In **Shared settings → Project locations**, add an item.
2. Give it a permanent lowercase key using only letters, numbers and hyphens, for example `bilbao-climate-forum`.
3. Select one of the six existing categories.
4. Enter latitude and longitude and optionally upload an image.
5. Open **Website translations → Website copy**.
6. In each locale tab, add an item under **Project translations** with exactly the same key.
7. Translate the title, country/region label and description in EN, ES and EU.
8. Save only when all three language entries exist.

The automated build stops if shared and localized project keys do not match, preventing an incomplete project from reaching production.

## Change a project

- Change coordinates, category or image in **Shared settings**.
- Change visible wording in the corresponding locale under **Website translations**.
- Do not change an established project key unless the same key is changed in all four locations: shared data plus EN, ES and EU.

## Remove a project

Remove the matching key from shared project locations and from the project-translation list in all three locale tabs in the same edit. A partial removal intentionally fails the build.

## Publishing checklist

Before publishing:

1. Confirm EN, ES and EU contain the intended copy.
2. Check that emphasized words and line breaks display correctly.
3. Check the affected section in both desktop and mobile deploy previews.
4. For map work, test **All projects** and the affected category filter.
5. Confirm uploaded media is sharp, correctly cropped and under 5 MB.
6. Confirm the deploy-preview build completes without errors.
7. Publish the entry from the editorial workflow only after those checks pass.

## Recovery

Every CMS save is stored as a Git commit. If an edit is incorrect, restore the last known-good commit or roll back to the preceding successful Netlify deploy. Do not delete repository history or rewrite the production branch.
