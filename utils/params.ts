/**
 *  Set URL query params using a typed objects
 *
 * This will convert an object
 *
 * ```js
 *  {
 *    foo: 'bar',
 *    age: 50,
 *  }
 * ```
 *
 * into a query string
 *
 * `?foo=bar&age=50`
 *
 * and append it to URL provided
 *
 * `https://api.example.com/tokens?foo=bar&age=50`
 *
 * @param url An URL instance
 * @param query An object containing all needed query params.
 */

export function setParams(url: URL, query: { [x: string]: any }) {
  Object.keys(query).map((key) => {
    let value = query[key]
    if (value !== undefined) {
      if (Array.isArray(value)) {
        value.forEach((item) => {
          url.searchParams.append(key, item)
        })
      } else {
        url.searchParams.append(key, query[key]?.toString())
      }
    }
    return url
  })
}

export function buildQueryString(query: { [x: string]: any }): string {
  const params: string[] = []

  for (const key in query) {
    const value = query[key]
    if (value !== undefined) {
      if (Array.isArray(value)) {
        for (const item of value) {
          params.push(`${key}=${item}`)
        }
      } else {
        params.push(`${key}=${value}`)
      }
    }
  }

  return params.join('&')
}
