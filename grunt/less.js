

module.exports = {

  options: {
    paths: 'node_modules'
  },

  dist: {
    // src: 'src/stylesheets/*',
    // src: ['src/stylesheets/map_tt.css'],
    // src: ['src/stylesheets/map_tt.css','src/stylesheets/style.css'],
    src: ['src/stylesheets/index.less'],
    // src: ['src/stylesheets/index.less','src/stylesheets/mapbox.css'],
    dest: '<%= site %>/style.css'
  }

};
