# Http boilerplate

Small wrapper around [fetch].
Often you don't need complex solutions to get data
but need some abstraction for fetchApi in your code.

For using it just copy and paste to your project.

## Example Get
```javascript
const response = await http.get<Item>(url);
if (response.success) {
  // response.data
} else {
  // parseError(response);
}
```

## Example Post
```javascript
const response = await http.post<DataRequest, DataResponse>(url, body, { signal });
if (response.success) {
// response.data
} else {
// parseError(response);
}
```

[fetch]: https://developer.mozilla.org/ru/docs/Web/API/Fetch_API
