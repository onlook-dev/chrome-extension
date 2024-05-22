# Onlook Angular builder

## Usage

1. Install builder library

```bash
npm i --save-dev @onlook/angular
```

2. Use the builder

Update your custom `angular.json` file to use the builder

```
"projects": {
  ...
  "example-app": {
    ...
    "architect": {
      ...
      "build": {
        "builder": "@onlook/angular:browser",
        "options": {
          ...
        },
      ...
      "serve": {
        "builder": "@onlook/angular:dev-server",
        "options": {
          ...
        }
```

This is an extension of the `@angular-builders/custom-webpack` builder so all options from there will still work.

3. Use the builder

Run the build

```
ng build
```

or

```
ng serve
```

## Example setup

[Pull request on example project](https://github.com/onlook-dev/angular-demo/pull/1)
