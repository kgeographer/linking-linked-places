lifeOfDance = 
{	"type": "PeriodCollection",
	"id": "0", "label": "Life of George Dance The Younger",
	"rev_date": "2013-09-28", "author": [{"name":"Unk. (from N. Coleman)"}],
	"projection": {"datetype": "year", "atom": "year", "origin": "0001-01-01", "calendar": "gregorian"},
	"periods": [
		{"id":0, "label": "George Dance The Younger's Life", "tSpans": [{"s":"1741-01-01","e":"1825-12-31"}]},
		{"id":1, "label": "Birth of G. Dance the Younger", "tSpans": [{"s":"1741"}], "class": "Event"},
		{"id":2, "label": "Death of G. Dance the Younger", "tSpans": [{"s":"1825"}], "class": "Event"},
		{"id":3, "label": "Founding of Royal Academy", "tSpans": [{"s":"1768"}], "class": "Event"},	
		{"id":4, "label": "Founding of Architects' Club", "tSpans": [{"s":"1791"}], "class": "Event"},	
		{"id":5, "label": "G. Dance appointed prof. of Architecture at RA", "tSpans": [{"s":"1798"}], "class": "Event"},	
		{"id":6, "label": "G. Dance resigns from RA", "tSpans": [{"s":"1806"}], "class": "Event"},

		{"id":7, "label": "George Dance The Younger's European Adventure", "tSpans": [
				{"s":"1758-12-01","ls":"1758-12-31","ee":">e13","e":"1764-12-31"}], "class": "Event"},
		{"id":8, "label": "departs Gravesend", "tSpans": [{"s":"1758-12-01","e":"1758-12-31"}], "class": "Event"},
		{"id":17, "label": "resides in Florence", "tSpans": [{"s":">e8.e","ls":"1759-03-21","e":"<e9.s"}], "class": "Event"}, 
		// discontinuous event: reside in Rome; two instance of Anzio trip appear in text, may be error
		{"id":9, "label": "resides in Rome", "tSpans": [
				{"s":"1759-05-01","ls":"1759-05-31","e":"1761-04-20"},
				{"s":"1761-05-01","ls":"1761-05-31","ee":"1763-04-01","e":"1763-04-30"},
				{"s":"1763-06-01","ls":"1763-06-30","e":"<e12.s"}	] },
		{"id":10, "label": "resides in Anzio", "tSpans": [{"s":"1763-04-20","ee":"1761-05-01","e":"1761-05-31"}], "class": "Event"},	
		{"id":11, "label": "recuperates in Anzio", "tSpans": [
				{"s":"1763-04-01","ls":"1763-04-30","ee":"1761-06-01","e":"1761-06-30"}], "class": "Event"}, 

		// reasoning for next three events is circular		
		{"id":12, "label": "resides in Naples", "tSpans": [{"s":"1764-06-01","ls":"1764-06-30","e":"<e13"}], "class": "Event"},
		{"id":13, "label": "arrives in Paris", "tSpans": [{"s":">e12","e":"1764-11-20"}], "class": "Event"},	// not after
		{"id":14, "label": "arrives in London", "tSpans": [{"s":">e13","e":"1764-12-31"}], "class": "Event"},	// not after

		{"id":15, "label": "Seven Years' War", "tSpans": [{"s":"1754-01-01","ls":"1756-05-13","ee":"1763-02-10","e":"1763-02-15"}], "class": "Event"},
		{"id":16, "label": "elected to the Accademia degli Arcadi in Rome (not present)", "tSpans": [{"s":"1764-12-21"}], "class": "Event"},	
		
		{"id":18, "label": "employ, City of London clerk of works", "tSpans":	[{"s":"1768","e":">1768"}], "class": "Span"},
		{"id":19, "label": "employ, Merchant Taylors’ Company, Master", "tSpans": [{"s":"1794","e":">1794"}], "class": "Span"},
		{"id":20, "label": "employ, Royal Academy, prof. of Architecture", "tSpans": [{"s":"1798","e":"1806"}], "class": "Span"},
		{"id":21, "label": "member, Royal Academy", "tSpans": [ {"s":"1768","ee":"1806","e":">1806"} ], "class": "Span"}
	],
	"rels": [
		{"id":0, "rel":["e0", "occurred_at", "<agg(loc(events(0-21)))>" ] },
		{"id":1, "rel":["e1", "occurred_at", "London, England" ] },
		{"id":2, "rel":["e2", "occurred_at", "London, England" ] },
		{"id":3, "rel":["e3", "occurred_at", "London, England" ] },
		{"id":4, "rel":["e4", "occurred_at", "London, England" ] },
		{"id":5, "rel":["e5", "occurred_at", "London, England" ] },
		{"id":6, "rel":["e6", "occurred_at", "London, England" ] },
		{"id":7, "rel":["e7", "occurred_at", "<agg(loc(events(8-14, 17)))>" ] }, 
		{"id":8, "rel":["e8", "occurred_at", "Gravesend, England" ] },
		{"id":17, "rel":["e17", "occurred_at", "Florence, Italy" ] },
		{"id":9, "rel":["e9", "occurred_at", "77 Strada Felice, Rome, Italy" ] },
		{"id":10, "rel":["e10", "occurred_at", "Anzio, Italy" ] },
		{"id":11, "rel":["e11", "occurred_at", "Anzio, Italy" ] },
		{"id":12, "rel":["e12", "occurred_at", "Naples, Italy" ] },
		{"id":13, "rel":["e13", "occurred_at", "Paris, France" ] },
		{"id":14, "rel":["e14", "occurred_at", "London, England" ] },
		{"id":15, "rel":["e15",	"occurred_at",	"<agg(look it up on Wikipedia)>" ] },	// Seven Years' War
		{"id":16, "rel":["e16", "occurred_at", "London, England" ] },
		// life has subevents
		{"id":17, "rel":["e0", "has_part", "e1" ] },
		{"id":18, "rel":["e0", "has_part", "e2" ] },
		{"id":19, "rel":["e0", "has_part", "e3" ] },
		{"id":20, "rel":["e0", "has_part", "e4" ] },
		{"id":21, "rel":["e0", "has_part", "e5" ] },
		{"id":22, "rel":["e0", "has_part", "e6" ] },
		{"id":23, "rel":["e0", "has_part", "e7" ] },
		{"id":24, "rel":["e0", "has_part", "e16" ] },
		{"id":25, "rel":["e0", "has_part", "e18" ] },
		{"id":26, "rel":["e0", "has_part", "e19" ] },
		{"id":27, "rel":["e0", "has_part", "e20" ] },
		{"id":28, "rel":["e0", "has_part", "e21" ] },
		// event 7 (Italy trip) has subevents
		{"id":29, "rel":["e7", "has_part", "e8" ] },
		{"id":30, "rel":["e7", "has_part", "e9" ] },
		{"id":31, "rel":["e7", "has_part", "e10" ] },
		{"id":32, "rel":["e7", "has_part", "e11" ] },
		{"id":33, "rel":["e7", "has_part", "e12" ] },
		{"id":34, "rel":["e7", "has_part", "e13" ] },
		{"id":35, "rel":["e7", "has_part", "e14" ] },
		{"id":36, "rel":["e7", "has_part", "e17" ] }
	]
}