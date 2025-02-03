# create-itch-tailwind 

[![package version](https://img.shields.io/npm/v/create-itch-tailwind.svg?style=flat-square)](https://npmjs.org/package/create-itch-tailwind)


Vite and Tailwind based CSS and HTML generator for itch.io [custom css](https://itch.io/docs/creators/css-guide) project pages.

This project is a spiritual successor to [itchpack](https://github.com/billiam/itchpack), which has many of the same features, but uses webpack and sass via a commandline tool.

Instead, Itch Tailwind is a collection of build scripts and configuration in a convenient project generator, so you can 
customize it as needed.

![Animation of create-itch-tailwind usage, showing interactive prompt to generate a new project, run a development server and create HTML and CSS output files](https://github.com/billiam/create-itch-tailwind/raw/main/docs/demo.gif?raw=true)

## Features

* HTML/CSS hot reloading via [Vite](https://vitejs.dev/)
* Split and organize assets with `@import` and `<include src="myfile.html">`
* Built in support for templating (using [posthtml-expressions](https://github.com/posthtml/posthtml-expressions))
* Data-driven templates (`data.yml` or `data.json` contents are passed to templates)
* All project configuration and build steps are available to customize within your project
* Supports TailwindCSS
* Automatically prefix all new classes with `-custom` in the CSS and HTML output

## Usage

Itch tailwind is designed to create one css file and one html file in an output directory, which you can then copy to your itch.io page.

### Generate a new project

```sh
npx create-itch-tailwind
```

Follow prompts to name your new project, and (optionally) download your project's existing content and layout.

```sh
cd <new project>
npm install
npm run start
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

### Development server

Once your project has been set up and your templates are downloaded, you can launch the development server using `npm run start`.

Open http://localhost:5173 (by default) to view your project preview. Changes to
your templates, data, or CSS will reload the page.

### Generate your HTML and CSS

When your project is ready, generate the final HTML and CSS using:

```
npm run build
```

This will create your final, minified HTML and CSS in the `dist` folder.

Copy the contents of `dist/index.html`, and paste it into your project's description form on itch.io (click the `<>` HTML button before pasting).

Copy the contents of `dist/style.css` to your project's custom css field in your project's theme editor.

The commands `npm run copy-html` and `npm run copy-css` will copy these to your clipboard.

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

### Default styles

By default, Tailwind adds a number of CSS resets, that mostly unstyle the content of your project page. 

To style your page content, you have a few options:

You can add the appropriate classes to your paragraphs, headings, and other elements individually.

You can add some base styles in `/src/index.css` (https://v1.tailwindcss.com/docs/adding-base-styles). You'll want to make sure these are scoped to the `user_formatted` so that they don't affect itch.io UI styling.

You can disable this reset entirely by removing or commenting out the `scopedPreflightStyles` plugin in `tailwind.config.js`, and removing the "additional resets" section added in `/src/index.css`

You can also enable the [tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) plugin (commented out by default in `tailwind.config.js`), and add the `prose` class to a wrapper element in your project.

## I want to use this, but not Tailwind

You can remove the Tailwind includes from your `src/index.css`, and you'll be good to go.  
You can also remove Tailwind entirely by removing it from package.json file, from the plugins list in `postcss.config.js` and removing the `tailwind.config.js`.
You may want to add purgecss as well so that unused styles can still be removed automatically, which Tailwind is handling.
