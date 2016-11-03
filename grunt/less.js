

module.exports = {

  options: {
    paths: 'node_modules'
  },

  dist: {
    src: 'src/stylesheets/index.less',
    dest: '<%= site %>/style.css'
  }

};
