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

client.search({
  index: 'oi',
  type: 'places',
  body: {
    query: {
      match: {
        label: 'Paris'
      }
    }
  }
}).then(function (resp) {
    var hits = resp.hits.hits;
    console.log('hits: ', hits)
}, function (err) {
    console.trace(err.message);
});
