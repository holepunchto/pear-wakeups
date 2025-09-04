# pear-wakeups

> Receive wakeup events, including link clicks external to app

## Usage

```js
import wakeups from 'pear-wakeups'
```

```js
const stream = wakeups()
stream.on('data', (wakeup) => {
  const { link, applink, entrypoint, fragment, query, linkData } = wakeup
  //...
})
```

```js
wakeups((wakeup) => {
  const { link, applink, entrypoint, fragment, query, linkData } = wakeup
  //...
})
```

A wakeup occurs in the following cases:

* when a trusted `pear://` link is clicked and the application for that link is already open
* when used with `pear run --detached pear://<key>[/data]`

The `listener` function is called for every incoming wakeup with a `wakeup` object of the form:

```js
{
  type: 'pear/wakeup',
  link: <String>,
  linkData: <String>,
  fragment: <String>,
  entrypoint: <String>
}
```

* `link` is the `pear://` link for the application receiving the wakeup
* `linkData` is everything after the key in the `pear://` link - this would be `pathname` of a [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL/URL) object but without the leading slash (`/`). Given `pear://8ts9yz9dtucxzwbxafygnjasqe9ti3dt3w7rm6sbiu8prmidacao/some/more/stuff` the `data` string would hold `some/more/stuff`.
* `fragment` is the `fragment` part of `pear://link#fragment` (location hash without the `#` prefix).
* `entrypoint` includes `entrypoint` of `pear://link/some/entry/point` (URL pathname).

Also returns a [`streamx`](https://github.com/mafintosh/streamx) `Readable`) stream.

## License

Apache-2.0