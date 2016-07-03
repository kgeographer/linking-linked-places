{
'dateTimeFormat': 'iso8601',
'wikiURL': "http://simile.mit.edu/shelf/",
'wikiSection': "Simile Cubism Timeline",

'events' : [
        {'start': '1850',
        'title': 'durationEvent false, start date',
        'durationEvent' : false
        },

        {'start': '1850',
        'end': '1855',
        'title': 'durationEvent false, start and end dates',
        'durationEvent' : false
        },

        {'start': '1850',
        'end': '1855',
        'title': 'durationEvent true, start and end dates',
        'durationEvent' : true
        },

        {'start': '1850',
        'latestStart': '1855',
        'end': '1865',
        'title': 'durationEvent true, start, latestStart, end dates',
        'durationEvent' : true
        },

        {'start': '1850',
        'latestStart': '1855',
        'earliestEnd': '1860',
        'end': '1865',
        'title': 'durationEvent true, start, latestStart, end, earliestEnd dates',
        'durationEvent' : true
        },

        {'start': '1850',
        'earliestEnd': '1860',
        'end': '1865',
        'title': 'durationEvent true, start, end, earliestEnd dates',
        'durationEvent' : true
        },

        {'start': '1880',
        'title': 'Test 1a: only start date, no durationEvent',
        'description': 'Test 1a: only start date, no durationEvent',
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1880',
        'title': 'Test 1b: only start date, isDuration true',
        'description': 'Test 1b: only start date, isDuration true',
        'isDuration' : true,
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1880',
        'title': 'Test 1b: only start date, durationEvent false',
        'description': 'Test 1b: only start date, durationEvent false',
        'durationEvent' : false,
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1880',
        'title': 'Test 1c: only start date, durationEvent true',
        'description': 'Test 1b: only start date, durationEvent true',
        'durationEvent' : true,
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1881',
        'title': 'Test 5a: All that really belongs to us is time; even he who has nothing else has that.',
        'description': 'Test 5a: really long labels',
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1900', 'end': '1899',
        'title': 'Test 6a: Bad dates: start > end',
        'description': 'Test 6a: Bad dates: start > end'
        },
        {'start': '1900', 'latestStart': '1899', 'end': '1905',
        'title': 'Test 6b: Bad dates: start > latestStart',
        'description': 'Test 6b: Bad dates: start > latestStart'
        },
        {'start': '1900', 'latestStart': '1901', 'earliestEnd': '1899', 'end': '1905',
        'title': 'Test 6c: Bad dates: start > earliesEnd',
        'description': 'Test 6c: Bad dates: start > earliesEnd'
        },
        {'start': '1900', 'latestStart': '1906', 'end': '1905',
        'title': 'Test 6d: Bad dates: latestStart > end',
        'description': 'Test 6d: Bad dates: latestStart > end'
        },
        {'start': '1900', 'latestStart': '1901', 'earliestEnd': '1900', 'end': '1905',
        'title': 'Test 6e: Bad dates: latestStart > earliestEnd',
        'description': 'Test 6e: Bad dates: latestStart > earliestEnd'
        },
        {'start': '1900', 'latestStart': '1901', 'earliestEnd': '1903', 'end': '1900',
        'title': 'Test 6f: Bad dates: latestStart > end',
        'description': 'Test 6f: Bad dates: latestStart > end'
        },
        {'start': '1900', 'latestStart': '1901', 'earliestEnd': '1903', 'end': '1902',
        'title': 'Test 6g: Bad dates: earliestEnd > end',
        'description': 'Test 6g: Bad dates: earliestEnd > end'
        },

        {'start': '1920', 'end': '1922',
        'title': 'Test 7a: special_event css (bolded)',
        'description': 'Test 7a: special_event css (bolded label and colored tape)',
        'classname': 'special_event' 
        },

        {'start': '1932',
        'end': '1935',
        'title': 'Test 2a: start and end dates. No isDuration',
        'description': 'Test 2a: start and end dates. No isDuration',
        'image': 'http://images.allposters.com/images/BRGPOD/75857_b.jpg',
        'link': 'http://www.allposters.com/-sp/Three-Figures-1913-28-Posters_i1349989_.htm'
        },

        {'start': '1932',
        'end': '1935',
        'title': 'Test 2b: start and end dates. durationEvent = false',
        'description': 'Test 2b: start and end dates. durationEvent = false',
        'image': 'http://images.allposters.com/images/BRGPOD/75857_b.jpg',
        'durationEvent' : false,
        'link': 'http://www.allposters.com/-sp/Three-Figures-1913-28-Posters_i1349989_.htm'
        },

        {'start': '1932',
        'end': '1935',
        'title': 'Test 2c: start and end dates. durationEvent = true',
        'description': 'Test 2c: start and end dates. durationEvent = true',
        'durationEvent' : true,
        'image': 'http://images.allposters.com/images/BRGPOD/75857_b.jpg',
        'link': 'http://www.allposters.com/-sp/Three-Figures-1913-28-Posters_i1349989_.htm'
        },

        {'start': '1932',
        'latestStart': '1935',
        'end': '1940',
        'title': 'Test 2d, durationEvent true, Start, latestStart, end dates',
        'durationEvent' : true,
        'description': 'Test 2d, durationEvent true, Start, latestStart, end dates',
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1932',
        'latestStart': '1935',
        'end': '1940',
        'title': 'Test 2e, durationEvent false, Start, latestStart, end dates',
        'durationEvent' : false,
        'description': 'Test 2e, durationEvent false, Start, latestStart, end dates',
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1932',
        'latestStart': '1935',
        'earliestEnd': '1940',
        'end': '1945',
        'title': 'Test 2f, durationEvent true, Start, latestStart, end, earliestEnd dates',
        'durationEvent' : true,
        'description': 'Test 2f, durationEvent true, Start, latestStart, end, earliestEnd dates',
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1932',
        'latestStart': '1935',
        'earliestEnd': '1940',
        'end': '1945',
        'title': 'Test 2g, durationEvent false, Start, latestStart, end, earliestEnd dates',
        'durationEvent' : false,
        'description': 'Test 2f, durationEvent false, Start, latestStart, end, earliestEnd dates',
        'image': 'http://images.allposters.com/images/AWI/NR096_b.jpg',
        'link': 'http://www.allposters.com/-sp/Barfusserkirche-1924-Posters_i1116895_.htm'
        },

        {'start': '1930',
        'end': '1940',
        'title': "Test 5b: If time flies when you're having fun, it hits the afterburners when you don't think you're having enough.",
        'description': 'Test 2a: start and end dates. No isDuration',
        'image': 'http://images.allposters.com/images/BRGPOD/75857_b.jpg',
        'link': 'http://www.allposters.com/-sp/Three-Figures-1913-28-Posters_i1349989_.htm'
        },


        {'start': '1881',
        'end': '1953',
        'description': 'Test 3a: No title. Start, end dates, isDuration = true',
        'image': 'http://images.allposters.com/images/mer/1336_b.jpg',
        'link': 'http://www.allposters.com/-sp/Landschaft-bei-Montreuil-Posters_i339007_.htm',
        'isDuration' : true,
        'icon' : "dark-red-circle.png",        
        'color' : 'red',
        'textColor' : 'green'},

        {'start': '1881',
        'end': '1953',
        'description': 'Test 3b: No title. Start, end dates, isDuration = false',
        'image': 'http://images.allposters.com/images/mer/1336_b.jpg',
        'link': 'http://www.allposters.com/-sp/Landschaft-bei-Montreuil-Posters_i339007_.htm',
        'isDuration' : false,
        'icon' : "dark-red-circle.png",        
        'color' : 'red',
        'textColor' : 'green'},

        {'start': '1885',
        'end': '1925',
        'title': 'Test 4',
        'description': 'Test 4: tapeImage, caption, classname attributes',
        'image': 'http://images.allposters.com/images/CORPOD/IX001463_b.jpg',
        'link': 'http://www.allposters.com/-sp/Castor-Et-Pollux-Posters_i831718_.htm',
        'tapeImage': 'blue_stripes.png',
        'tapeRepeat': 'repeat-x',
        'caption': "This is the event's caption attribute.",
        'classname': 'hot_event' 
        },

        {'start': '1920',
        'title': 'Femme au Miroir',
        'description': 'by Fernand Leger, French Painter, 1881-1955',
        'image': 'http://images.allposters.com/images/AWI/GMR117_b.jpg',
        'link': 'http://www.allposters.com/-sp/Femme-au-Miroir-1920-Posters_i141266_.htm'
        },


        {'start': '1903',
        'title': 'The Old Guitarist',
        'description': 'by Pablo Picasso, Spanish Painter/Sculptor, 1881-1973',
        'image': 'http://images.allposters.com/images/ESC/AP599_b.jpg',
        'link': 'http://www.allposters.com/-sp/The-Old-Guitarist-c-1903-Posters_i328746_.htm'
        },


        {'start': '1882',
        'end': '1964',
        'title': 'Jour',
        'description': 'by Georges Braque, French Painter, 1882-1963',
        'image': 'http://images.allposters.com/images/SHD/S1041_b.jpg',
        'link': 'http://www.allposters.com/-sp/Jour-Posters_i126663_.htm',
        'color': 'green'
        },


        {'start': '1916',
        'title': 'Still Life with a White Dish',
        'description': 'by Gino Severini, Italian Painter, 1883-1966',
        'image': 'http://images.allposters.com/images/MCG/FS1254_b.jpg',
        'link': 'http://www.allposters.com/-sp/Still-Life-with-a-White-Dish-1916-Posters_i366823_.htm'
        },


        {'start': '1885',
        'end': '1941',
        'title': 'Rhythm, Joie de Vivre',
        'description': 'by Robert Delaunay, French Painter, 1885-1941',
        'image': 'http://imagecache2.allposters.com/images/pic/adc/10053983a_b~Rhythm-Joie-de-Vivre-Posters.jpg',
        'link': 'http://www.allposters.com/-sp/Rhythm-Joie-de-Vivre-Posters_i1250641_.htm'
        },


        {'start': '1912',
        'title': 'Portrait of Pablo Picasso',
        'description': 'by Juan Gris, Spanish Painter/Sculptor, 1887-1927',
        'image': 'http://images.allposters.com/images/BRGPOD/156514_b.jpg',
        'link': 'http://www.allposters.com/-sp/Portrait-of-Pablo-Picasso-1881-1973-1912-Posters_i1344154_.htm'
        },


        {'start': '1891',
        'end': '1915',
        'title': 'Portrait of Horace Brodsky',
        'description': 'by Henri Gaudier-Brzeska, French Sculptor, 1891-1915',
        'image': 'http://imagecache2.allposters.com/images/BRGPOD/102770_b.jpg',
        'link': 'http://www.allposters.com/-sp/Portrait-of-Horace-Brodsky-Posters_i1584413_.htm'
        }
]
}
