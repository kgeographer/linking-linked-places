var elasticsearch = require('elasticsearch');
window.client = new elasticsearch.Client({
  host: 'localhost:9200',
  // log: 'trace'
});
client.ping({
    requestTimeout: Infinity,
  }, function (error) {
    if (error) {
      console.trace('elasticsearch cluster is down!');
    } else {
    console.clear();
    console.log('elasticized!');
  }
});

// Load in our dependencies
var ElasticsearchCompletion = require('elasticsearch-completion');

// Initialize our query completion mechanism
var esCompletion = new ElasticsearchCompletion([
  'toponym',
  'gazetteer_label'
]);

// Bind our typeahead
$('#bloodhound').typeahead({
  minLength: 0,
  highlight: true
}, {
  name: 'elasticsearch',
  source: function (query, syncResults) {
    // Resolve and return matching queries
    syncResults(esCompletion.match(query));
  }
});

// client.search({
//   index: 'oi',
//   type: 'places',
//   body: {
//     query: {
//       match: {
//         label: 'france'
//       }
//     }
//   }
// }).then(function (resp) {
//     window.hits = resp.hits.hits;
//     console.log('hits: ', hits)
// }, function (err) {
//     console.trace(err.message);
// });
