# havarot
Node package for israel's company registry

The package provides a simple function used for searching the registry either by name or by a company number.

## Exmaple

### Search companies by name

```js
const havarot = require('havarot');

bankotsar({
  name: 'שם עסק'
}).then(function (companies) {
  // companies will contain what the goverment's registry thinks is relevant to your search
});
```

### Get company by number

```js
const havarot = require('havarot');

havarot({
  number: '111111215'
}).then(function (companies) {
  // companies is still an array
});
```

companies are returned as an array of objects with the following data:
* id - the registered number of the company, used as a unique identifier,
* name - the hebrew name of the company,
* engName - the english name of the company, not all companies have an english name,