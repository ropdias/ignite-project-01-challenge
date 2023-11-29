// /users/:id

export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g;
  const pathWithParams = path.replaceAll(
    routeParametersRegex,
    '(?<$1>[a-z0-9-_]+)'
  );

  //const test = /\/users\/([a-z0-9-_]+)/
  const pathRegex = new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`);

  // Every RegExp has a .test() method that returns true or false if the string in that regex is valid or not

  return pathRegex;
}
