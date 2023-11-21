module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],

  
  module: {
    rules: [
      {
        test: /opencv\.js$/,
        use: [
          {
            loader: 'worker-loader',
            options: {
              inline: true,
              fallback: false,
            },
          },
        ],
      },
    ],
  },

  resolve: {
    alias: {
      'opencv.js': 'opencv.js/dist/opencv.js',
    },
  },
}
