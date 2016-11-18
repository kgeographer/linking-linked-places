

module.exports = {

  options: {
    paths: 'node_modules'
  },

  dist: {
    src: ['src/stylesheets/index.less','src/stylesheets/typeahead.css'],
    dest: '<%= site %>/style.css'
  }

};
