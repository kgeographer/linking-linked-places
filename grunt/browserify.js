

module.exports = {

  options: {

    transform: [

      ['babelify', {
        presets: ['es2015', 'stage-1']
      }],

      ['brfs']
    ],

    watch: true,

    browserifyOptions: {
      debug: true
    }

  },

  dist: {
    // src: 'src/javascripts/*',
    src: ['src/javascripts/timeline_tt.js','src/javascripts/map_tt.js'],
    dest: '<%= site %>/script.js'
  }

};
