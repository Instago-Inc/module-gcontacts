# @instago/gcontacts

Google Contacts wrapper built on `gauth@1.0.0` and People API.

- Version: 1.0.0
- Entry: index.js
- Exports: `list`, `search`, `get`, `otherList`, `otherSearch`, `create`, `update`, `remove`, `directoryList`, `directorySearch`
- Dependencies: `http@1.0.0`, `auth@1.0.0`, `gauth@1.0.0`, `qs@1.0.0`

## Auth and configuration
You must configure `gauth@1.0.0` before using gcontacts. Provide the required env keys so the helper can mint tokens:

- `gauth.clientId`
- `gauth.clientSecret`

`gauth` handles refresh tokens internally, so there’s no need to expose them here.

Optional env:

- `gauth.scope` or `google.scope`
- `gauth.tokenEndpoint` (if you need a custom token URL)

Common scopes:
- `contacts` (rw), `contacts.readonly`
- `directory.readonly` (Workspace directory)
- `all` or `*` for every mapped scope

Configure once, then call gcontacts methods with the desired scope overrides.

## Usage
```js
const gauth = require('gauth@1.0.0');
const gcontacts = require('gcontacts@1.0.0');

gauth.configure({
  clientId: sys.env.get('gauth.clientId'),
  clientSecret: sys.env.get('gauth.clientSecret'),
});
```

## Examples
Personal contacts:
```js
await gcontacts.list({ maxResults: 50 });
await gcontacts.search({ query: 'Ada', maxResults: 50 });
await gcontacts.get({ resourceNameOrEmail: 'people/123' });
await gcontacts.get({ resourceNameOrEmail: 'user@example.com' });
```

Other contacts:
```js
await gcontacts.otherList({ maxResults: 50 });
await gcontacts.otherSearch({ query: 'John', maxResults: 50 });
```

Create and update:
```js
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
```

Directory (Workspace):
```js
await gcontacts.directoryList({ maxResults: 50 });
await gcontacts.directorySearch({ query: 'Jane', maxResults: 50 });
```

---
For more details, visit https://instago.ai.
