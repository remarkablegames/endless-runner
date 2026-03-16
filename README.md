<p align="center">
  <img src="public/logo.svg" width="250" alt="Babylon Template">
</p>

# Babylon Template

[![release](https://img.shields.io/github/v/release/remarkablegames/babylon-template)](https://github.com/remarkablegames/babylon-template/releases)
[![build](https://github.com/remarkablegames/babylon-template/actions/workflows/build.yml/badge.svg)](https://github.com/remarkablegames/babylon-template/actions/workflows/build.yml)

<kbd>babylon-template</kbd> is a template for building [Babylon.js](https://github.com/BabylonJS/Babylon.js) games.

Play the game on:

- [remarkablegames](https://remarkablegames.org/babylon-template/)

## Prerequisites

[nvm](https://github.com/nvm-sh/nvm#installing-and-updating):

```sh
brew install nvm
```

## Install

Clone the repository:

```sh
git clone https://github.com/remarkablegames/babylon-template.git
cd babylon-template
```

Install the dependencies:

```sh
npm install
```

Rename the project:

```sh
git grep -l babylon-template | xargs sed -i '' -e 's/babylon-template/my-game/g'
```

```sh
git grep -l 'Babylon Template' | xargs sed -i '' -e 's/Babylon Template/My Game/g'
```

Update the files:

- [ ] `README.md`
- [ ] `index.html`
- [ ] `package.json`
- [ ] `public/logo.svg`
- [ ] `public/manifest.webmanifest`

## Environment Variables

Update the environment variables:

```sh
cp .env .env.local
```

Update the **Secrets** in the repository **Settings**.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the game in development mode.

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

The page will reload if you make edits.

You will also see any errors in the console.

### `npm run build`

Builds the game for production to the `dist` folder.

It correctly bundles in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.

Your game is ready to be deployed!

### `npm run bundle`

Builds the game and compresses the contents into a ZIP archive in the `dist` folder.

Your game can be uploaded to your server, [itch.io](https://itch.io/), [newgrounds](https://www.newgrounds.com/), etc.

## License

[MIT](LICENSE)
