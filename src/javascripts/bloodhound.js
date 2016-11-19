require('handlebars')

var toponyms = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace(['toponym','altnames']),
  // datumTokenizer: Bloodhound.tokenizers.whitespace,
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  local: placenames
  // local: states
});

// var source   = $("#place-template").html();
var template = Handlebars.compile($("#place-template").html());


$('#bloodhound .typeahead').typeahead({
  hint: true,
  highlight: true,
  minLength: 1
},
{
  name: 'places',
  limit: 10,
  display: 'value',
  // display: 'label',
  source: toponyms,
  templates: {
    empty: [
      '<div class="empty-message">',
        'no matches',
      '</div>'
      ].join('\n'),
    suggestion: template
  }
});

$(".typeahead").on("typeahead:select", function(e,obj){
  console.log(obj)
  // $('.typeahead').typeahead('val')
  // value = $('input.search-input').val();
  // console.log(data)
})
