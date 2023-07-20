## New Globe Frontend Assessment - Battery Maintenance app.
This is a simple app that uses some local data to track field support for batteries. 

## Tools used
- Nuxt 3
- Tailwind CSS

## Key Design Choices and Assumptions
- When batteries have the same charge on multiple readings, only the first timestamp is used to compare the discharge duration till a different charge value is added.
-  Data about how many batteries per school are bad is stored differently from the actual processed data set.
- Currently not using the employeeID for anything but kept it in the processing in case a new feature could be added.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm run dev

# yarn
yarn dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm run build

# yarn
yarn build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm run preview

# yarn
yarn preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.
