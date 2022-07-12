const withTM = require("next-transpile-modules")(["react-timezone-select","suneditor/src/plugins","@tinymce/tinymce-react"]);
module.exports = withTM({
  reactStrictMode: false,
});
