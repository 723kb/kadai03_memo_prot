/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html', // index.html を含める
    './todo.html',
    './**/*.{html,js}', // プロジェクト内の他のHTMLおよびJSファイルを含める
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
