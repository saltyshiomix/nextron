const resolve = (pathname:string) => {
  if (process.env.NODE_ENV === "production") {
    if (/\.(png|jpe?g|gif|svg|js|css)(\?.*)?$/.test(pathname)) {
      return `../${pathname}`;
    }
    return `../${pathname}/index.html`;
  }
  return "/" + pathname;
}

export { resolve };
