# Create Itch Tailwind

Vite and Tailwind based CSS and HTML generator for itch.io [custom css](https://itch.io/docs/creators/css-guide) project pages.

This project is a spiritual successor to [itchpack](https://github.com/billiam/itchpack), which has many of the same features, but uses webpack and sass via a commandline tool.

Instead, Itch Tailwind is a collection of build scripts and configuration in a convenient project generator, so you can 
customize it as needed.

## Features

* HTML/CSS hot reloading via [Vite](https://vitejs.dev/)
* Split and organize assets with `@import` and `<include src="myfile.html">`
* Built in support for templating with HTML (using [posthtml-expressions](https://github.com/posthtml/posthtml-expressions)) and EJS
* Pluggable templating for other formats like, handlebars, markdown, etc. using [posthtml-include-whatever](https://github.com/billiam/posthtml-include-whatever)
* Data-driven templates (`data.yml` or `data.json` contents are passed to templates)
* All project configuration and build steps are available to customize within your project
* Supports TailwindCSS
* Automatically prefix all new classes with `-custom` in the CSS and HTML output

## Usage

### Generate a new project

```sh
npx create-itch-tailwind
```

Follow prompts to name your new project, and (optionally) download your project's existing content and layout.

```sh
cd <new project>
npm install
npm run dev
```

### Project structure

```
Project/
├── index.html # Itch.io wrapper template (read only)
├── [various configuration and dotfiles]
├── src/
|   ├── index.css # Project CSS
|   ├── index.html # Project HTML
|   └── data.yml (or data.json) # data you can use in your templates
└── dist/
    ├── style.css # Output CSS
    └── index.html # Output HTML
```

### Fetching or updating project content

```
npx create-itch-tailwind fetch-templates <https://yourname.itch.io/yourproject>
```

This will download your project's HTML content to `src/index.html` and the static, itch.io template to `/index.html`, adding an `<include>` to wrap your project markup.

By default, files that already exist will be skipped.

### Generate your HTML and CSS

When your project is ready, generate the final HTML and CSS using:

```
npm run build
```

This will create your final, minified HTML and CSS in the `dist` folder.

Copy the contents of `dist/index.html`, and paste it into your project's description form on itch.io (click the `<>` HTML button before pasting).

Copy the contents of `dist/style.css` to your project's custom css field in your project's theme editor.

### Working with template data

Data in `/src/data.yml` (or `/src/data.json`) can be used in your templates using [posthtml-expressions](https://github.com/posthtml/posthtml-expressions) tags.

`/src/data.yml`:
```yml
---
greeting: Hello!
headings:
  - Guides
  - Screenshots
```

`/src/index.html`:
```html
<h1>{{ greeting }}</h1>

<each loop="heading in headings">
<h2>{{ item }}</h2>
</each>
```

### Adding new template formats

If you'd like to use another template format not included with Itch Tailwind, you can!

Add the relevant template processor, like handlebars:

```sh
npm add handlebars
```

Edit `build/template-renderers.js`, and add a new method to the exported object, which accepts a template file and returns a string:

```js
import fs from 'fs'
import Handlebars from 'handlebars'

export default {
  //...
  handlebars: (template, { encoding, locals }) => {
    const templateData = fs.readFileSync(template, encoding)
    const hbTemplate = Handlebars.compile(templateData)
    return hbTemplate(locals)
  }
}
```

Then, include your handlebars content from your index page:

```html
<header>
  <include src="my-handlebars-partial.hbs" type="handlebars">
</header>
```

See also: [Limitations](#limitations)

### Default styles

By default, Tailwind adds a number of CSS resets, that mostly unstyle the content of your project page. 

To style your page content, you have a few options:

You can add the appropriate classes to your paragraphs, headings, and other elements individually.

You can add some base styles in `/src/index.css` (https://v1.tailwindcss.com/docs/adding-base-styles). You'll want to make sure these are scoped to the `user_formatted` so that they don't affect itch.io UI styling.

You can disable this reset entirely by removing or commenting out the `scopedPreflightStyles` plugin in `tailwind.config.js`, and removing the "additional resets" section added in `/src/index.css`

You can also enable the [tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) plugin (commented out by default in `tailwind.config.js`), and add the `prose` class to a wrapper element in your project.

## Limitations

The default `<include>` tag, which supports variables and expressions, does _not_ support nested include tags for other template types. All nested include tags will be treated as HTML content, regardless of the `type`.

If you want to include other template formats (like ejs, pug, handlebars etc) within HTML templates, you can replace the default call to `<include "index.html">` in the root `index.html` template file with `<include "index.html" type="html">`. This template type is not expression-aware, but _does_ support nested non-html templates. 

## I want to use this, but not Tailwind

You can remove the Tailwind includes from your `src/index.css`, and you'll be good to go.  
You can also remove Tailwind entirely by removing it from package.json file, from the plugins list in `postcss.config.js` and removing the `tailwind.config.js`.
You may want to add purgecss as well so that unused styles can still be removed automatically, which Tailwind is handling.
