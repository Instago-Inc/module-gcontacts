# module/gcontacts - V8 module

Stay on top of your Google contacts with a small helper that keeps the workflow simple and focused. It is designed for quick lookups, updates, and directory searches without extra ceremony.

Learn more about the platform at https://instago.ai.

## Technical reference

Exports:
- `list({ maxResults?, scope? })`
- `search({ query, maxResults?, scope? })`
- `get({ resourceNameOrEmail, scope? })`
- `otherList({ maxResults?, scope? })`
- `otherSearch({ query, maxResults?, scope? })`
- `create({ givenName?, familyName?, email?, phone?, scope? })`
- `update({ resourceName, givenName?, familyName?, email?, phone?, scope? })`
- `remove({ resourceName, scope? })`
- `directoryList({ maxResults?, scope? })`
- `directorySearch({ query, maxResults?, scope? })`

Usage:
```js
const gcontacts = require('gcontacts@latest');
```

Configuration (env.json):
- Required:
  - `gauth.clientId`
  - `gauth.clientSecret`
- Optional:
  - `gauth.scope`
  - `gauth.tokenEndpoint`
  - `google.scope`

Examples:
```js
const gcontacts = require('gcontacts@latest');

await gcontacts.list({ maxResults: 50 });
await gcontacts.search({ query: 'Ada', maxResults: 25 });
await gcontacts.get({ resourceNameOrEmail: 'people/123' });
await gcontacts.get({ resourceNameOrEmail: 'user@example.com' });

await gcontacts.otherList({ maxResults: 50 });
await gcontacts.otherSearch({ query: 'John', maxResults: 25 });

await gcontacts.create({
  givenName: 'John',
  familyName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});

await gcontacts.update({
  resourceName: 'people/123',
  givenName: 'Jane',
  email: 'jane@example.com'
});

await gcontacts.remove({ resourceName: 'people/123' });

await gcontacts.directoryList({ maxResults: 50 });
await gcontacts.directorySearch({ query: 'Jane', maxResults: 25 });
```
