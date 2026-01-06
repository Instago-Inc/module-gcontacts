// Google Contacts (People API) helper using gauth@1.0.0.
//
// API (selected):
// - list({ maxResults?, scope? })
// - search({ query, maxResults?, scope? })
// - get({ resourceNameOrEmail, scope? })
// - otherList({ maxResults?, scope? })
// - otherSearch({ query, maxResults?, scope? })
// - create({ givenName?, familyName?, email?, phone?, scope? })
// - update({ resourceName, givenName?, familyName?, email?, phone?, scope? })
// - remove({ resourceName, scope? })
// - directoryList({ maxResults?, scope? })
// - directorySearch({ query, maxResults?, scope? })

(function() {
  const httpx = require('http@1.0.0');
  const auth = require('auth@1.0.0');
  const gauth = require('gauth@1.0.0');
  const qs = require('qs@1.0.0');

  const PEOPLE_BASE = 'https://people.googleapis.com/v1';
  const DEFAULT_SCOPE = ['contacts'];
  const DEFAULT_FIELDS = 'names,emailAddresses,phoneNumbers';

  function resolveScope(opts) {
    return (opts && (opts.scope || opts.scopes || opts.services)) || DEFAULT_SCOPE;
  }

  async function request({ path, method, params, bodyObj, scope }) {
    const token = await gauth.auth({ scope: resolveScope({ scope }) });
    let url = PEOPLE_BASE + '/' + String(path || '').replace(/^\//, '');
    if (params && typeof params === 'object') {
      const q = qs.encode(params);
      if (q) url += '?' + q;
    }
    const headers = Object.assign({ 'Content-Type': 'application/json' }, auth.bearer(token));
    const res = await httpx.json({ url, method: method || 'GET', headers, bodyObj });
    const status = res && res.status;
    const ok = res && (typeof res.ok === 'boolean' ? res.ok : !(status >= 400));
    return { ok, status, data: (res && (res.json || res.raw)) || null, raw: res && res.raw };
  }

  async function list({ maxResults, scope } = {}) {
    const params = {
      personFields: DEFAULT_FIELDS
    };
    if (maxResults) params.pageSize = Number(maxResults) || 0;
    return await request({ path: 'people/me/connections', params, scope });
  }

  async function search({ query, maxResults, scope } = {}) {
    if (!query) return { ok: false, error: 'gcontacts.search: query required' };
    const params = { query: String(query), readMask: DEFAULT_FIELDS };
    if (maxResults) params.pageSize = Number(maxResults) || 0;
    return await request({ path: 'people:searchContacts', params, scope });
  }

  async function get({ resourceNameOrEmail, scope } = {}) {
    if (!resourceNameOrEmail) return { ok: false, error: 'gcontacts.get: resourceNameOrEmail required' };
    const value = String(resourceNameOrEmail);
    if (value.indexOf('@') >= 0) {
      const res = await search({ query: value, maxResults: 1, scope });
      if (!res.ok) return res;
      const results = (res.data && res.data.results) ? res.data.results : [];
      return { ok: true, data: results[0] || null };
    }
    if (value.indexOf('otherContacts/') === 0) {
      return await request({ path: value, params: { readMask: DEFAULT_FIELDS }, scope });
    }
    return await request({ path: value, params: { personFields: DEFAULT_FIELDS }, scope });
  }

  async function otherList({ maxResults, scope } = {}) {
    const params = { readMask: DEFAULT_FIELDS };
    if (maxResults) params.pageSize = Number(maxResults) || 0;
    return await request({ path: 'otherContacts', params, scope });
  }

  async function otherSearch({ query, maxResults, scope } = {}) {
    if (!query) return { ok: false, error: 'gcontacts.otherSearch: query required' };
    const params = { query: String(query), readMask: DEFAULT_FIELDS };
    if (maxResults) params.pageSize = Number(maxResults) || 0;
    return await request({ path: 'otherContacts:search', params, scope });
  }

  function buildContact({ givenName, familyName, email, phone }) {
    const person = {};
    const names = [];
    if (givenName || familyName) {
      names.push({ givenName: givenName || '', familyName: familyName || '' });
    }
    if (names.length) person.names = names;
    if (email) person.emailAddresses = [{ value: String(email) }];
    if (phone) person.phoneNumbers = [{ value: String(phone) }];
    return person;
  }

  async function create({ givenName, familyName, email, phone, scope } = {}) {
    const person = buildContact({ givenName, familyName, email, phone });
    if (!Object.keys(person).length) return { ok: false, error: 'gcontacts.create: missing data' };
    return await request({ path: 'people:createContact', method: 'POST', bodyObj: person, scope });
  }

  async function update({ resourceName, givenName, familyName, email, phone, scope } = {}) {
    if (!resourceName) return { ok: false, error: 'gcontacts.update: resourceName required' };
    const person = buildContact({ givenName, familyName, email, phone });
    const fields = [];
    if (person.names) fields.push('names');
    if (person.emailAddresses) fields.push('emailAddresses');
    if (person.phoneNumbers) fields.push('phoneNumbers');
    if (!fields.length) return { ok: false, error: 'gcontacts.update: no fields provided' };
    const params = { updatePersonFields: fields.join(',') };
    return await request({ path: resourceName + ':updateContact', method: 'PATCH', params, bodyObj: person, scope });
  }

  async function remove({ resourceName, scope } = {}) {
    if (!resourceName) return { ok: false, error: 'gcontacts.remove: resourceName required' };
    return await request({ path: resourceName + ':deleteContact', method: 'DELETE', scope });
  }

  async function directorySearch({ query, maxResults, scope } = {}) {
    if (!query) return { ok: false, error: 'gcontacts.directorySearch: query required' };
    const params = { query: String(query), readMask: DEFAULT_FIELDS, sources: 'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE' };
    if (maxResults) params.pageSize = Number(maxResults) || 0;
    return await request({ path: 'people:searchDirectoryPeople', params, scope });
  }

  async function directoryList({ maxResults, scope } = {}) {
    const params = { query: '', readMask: DEFAULT_FIELDS, sources: 'DIRECTORY_SOURCE_TYPE_DOMAIN_PROFILE' };
    if (maxResults) params.pageSize = Number(maxResults) || 0;
    return await request({ path: 'people:searchDirectoryPeople', params, scope });
  }

  module.exports = {
    list,
    search,
    get,
    otherList,
    otherSearch,
    create,
    update,
    remove,
    directoryList,
    directorySearch
  };
})();
