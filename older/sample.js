twentyCWars = {
    type: "PeriodEvents",
    projection: {atom: "day", origin: "1917-01-01", datetype: "date", scale: 0.5},
    periodCollection: [
        {label: "World War I", tSpans: ["1914-07-28", "1918-11-11"], events: [0]},
        {label: "World War II", tSpans: ["1939-09-01", "1945-05-08"], events: [1]},
        {label: "Eastern Front", tSpans: ["1941-06-22", "1945-05-09"], events: [1]},        
        {label: "Korean War", tSpans: ["1950-06-25", "1953-06-21"]},
        {label: "Vietnam War", tSpans: ["1961-01-01", "1973-01-01"], events: [2,3]},
        {label: "Gulf War I", tSpans: ["1991-01-01", "1991-12-31"]},
        {label: "Some other War", tSpans: ["1948-01-01", "1968-12-31"], events: [2,3]},
        {label: "Some other War 2", tSpans: ["1948-01-01", "1963-12-31"], events: [2]}
    ],
    eventCollection: [
        {id: 0, label: "Introduction of the Tank", tSpans: "1915-9-15"},
        {id: 1, label: "Introduction of the Jet Fighter", tSpans: "1944-4-19"},
        {id: 2, label: "Introduction of Sharks with Lasers", tSpans: "1962-4-19"},
        {id: 3, label: "Magic", tSpans: "1965-4-19"}

    ]
    
}

warsNoProj = {
    type: "PeriodEvents",
    periodCollection: [
       {label: "World War I", tSpans: ["1914-07-28", "1918-11-11"], events: [0]},
        {label: "World War II", tSpans: ["1939-09-01", "1945-05-08"], events: [1]},
        {label: "Eastern Front", tSpans: ["1941-06-22", "1945-05-09"], events: [1]},        
        {label: "Korean War", tSpans: ["1950-06-25", "1953-06-21"]},
        {label: "Vietnam War", tSpans: ["1961-01-01", "1973-01-01"], events: [2,3]},
        {label: "Gulf War I", tSpans: ["1991-01-01", "1991-12-31"]},
        {label: "Some other War", tSpans: ["1948-01-01", "1968-12-31"], events: [2,3]},
        {label: "Some other War 2", tSpans: ["1948-01-01", "1963-12-31"], events: [2]}
    ],
    eventCollection: [
        {id: 0, label: "Introduction of the Tank", tSpans: "1915-9-15"},
        {id: 1, label: "Introduction of the Jet Fighter", tSpans: "1944-4-19"},
        {id: 2, label: "Introduction of Sharks with Lasers", tSpans: "1962-4-19"},
        {id: 3, label: "Magic", tSpans: "1965-4-19"}

    ]
    
}
someLives = {
    type: "PeriodEvents",
    projection: {atom: "day", origin: "1870-01-01", datetype: "date", scale: 0.01},
    periodCollection: [
        {label: "Bill", tSpans: ["1862-07-28", "1918-11-11"], events: [0]},
        {label: "Bob", tSpans: ["1895-09-01", "1945-05-08"], events: [1,2]},
        {label: "Mary", tSpans: ["1903-06-22", "1945-06-09"], events: [1,2]},        
        {label: "Margaret", tSpans: ["1904-06-25", "1953-06-21"], events: [0]},
        {label: "Lin", tSpans: ["1941-01-01", "1973-01-01"], events: [2]}
    ],
    eventCollection: [
        {id: 0, label: "Marriage", tSpans: "1915-9-15"},
        {id: 1, label: "Divorce", tSpans: "1944-4-19"},
        {id: 2, label: "Child", tSpans: "1944-4-19"}
        
    ]
    
}

someCountries = {
    type: "PeriodEvents",
    projection: {atom: "year", origin: "1800-01-01", datetype: "date", scale: 3},
    periodCollection: [
        {label: "United States of America", tSpans: ["1776-07-04", "2013-12-31"], events: [2,3,5]},
        {label: "Confederate States of America", tSpans: ["1861-05-01", "1865-05-01"], events: [2,3,5]},
        {label: "Kingdom of France", tSpans: ["1453-01-01", "1789-12-31"], events: [6]},
        {label: "Republic of France", tSpans: ["1792-07-14", "2013-12-31"], events: [0,1,2,3]},
        {label: "The United Kingdom", tSpans: ["1707-05-01", "2013-12-31"], events: [0,1,2,3]},
        {label: "Imperial Russia", tSpans: ["1721-07-04", "1916-06-31"], events: [2]},
        {label: "Soviet Russia", tSpans: ["1916-07-01", "1991-12-31"], events: [2,3]},
        {label: "German Empire", tSpans: ["1871-01-01", "1918-12-31"], events: [0,1,2]},
        {label: "Weimar Republic", tSpans: ["1919-01-02", "1936-12-31"], events: []},
        {label: "Nazi Germany", tSpans: ["1937-01-02", "1945-12-31"], events: [3]},
    ],
    eventCollection: [
        {id: 0, label: "First Morroccan Crisis", tSpans: ["1905-03-01","1906-05-3"]},
        {id: 1, label: "Second Morroccan Crisis", tSpans: "1911-07-01"},
        {id: 2, label: "World War I", tSpans: ["1914-07-28", "1918-11-11"]},
        {id: 3, label: "World War II", tSpans: ["1939-09-01", "1945-05-08"]},
        {id: 4, label: "Assassination of Abraham Lincoln", tSpans: "1865-04-15"},
        {id: 5, label: "The American Civil War", tSpans: ["1861-04-12", "1865-05-10"]},
        {id: 6, label: "The American Revolution", tSpans: ["1775-04-19", "1783-09-03"]}
   
    ]
    
}

someCountriesKarl = {
    type: "PeriodCollection",
    id: "0",
    label: "Some Countries in Karl JSON data format",
    rev_date: "1900-01-01",
    author: "Elijah Meeks",
    projection: {atom: "year", origin: "1800-01-01", datetype: "date", scale: 3},
    Features: [
        {id: 7, label: "United States of America", tSpans: ["1776-07-04", "2013-12-31"], rels: [2,3,5,6], class: "HistPeriod"},
        {id: 8, label: "Confederate States of America", tSpans: ["1861-05-01", "1865-05-01"], rels: [5], class: "HistPeriod"},
        {id: 9, label: "Kingdom of France", tSpans: ["1453-01-01", "1789-12-31"], rels: [6], class: "HistPeriod"},
        {id: 10, label: "Republic of France", tSpans: ["1792-07-14", "2013-12-31"], rels: [0,1,2,3,8], class: "HistPeriod"},
        {id: 11, label: "The United Kingdom", tSpans: ["1707-05-01", "2013-12-31"], rels: [0,1,2,3,6], class: "HistPeriod"},
        {id: 12, label: "Imperial Russia", tSpans: ["1721-07-04", "1916-06-31"], rels: [2,11], class: "HistPeriod"},
        {id: 13, label: "Soviet Russia", tSpans: ["1916-07-01", "1991-12-31"], rels: [3], class: "HistPeriod"},
        {id: 14, label: "German Empire", tSpans: ["1871-01-01", "1918-12-31"], rels: [0,1,2,9], class: "HistPeriod"},
        {id: 15, label: "Weimar Republic", tSpans: ["1919-01-02", "1936-12-31"], rels: [10], class: "HistPeriod"},
        {id: 16, label: "Nazi Germany", tSpans: ["1937-01-02", "1945-12-31"], rels: [3], class: "HistPeriod"},
        {id: 0, label: "First Morroccan Crisis", tSpans: ["1905-03-01","1906-05-3"], class: "Event"},
        {id: 1, label: "Second Morroccan Crisis", tSpans: "1911-07-01", class: "Event"},
        {id: 2, label: "World War I", tSpans: ["1914-07-28", "1918-11-11"], class: "Event"},
        {id: 3, label: "World War II", tSpans: ["1939-09-01", "1945-05-08"], class: "Event"},
        {id: 4, label: "Assassination of Abraham Lincoln", tSpans: "1865-04-15", class: "Event"},
        {id: 5, label: "The American Civil War", tSpans: ["1861-04-12", "1865-05-10"], class: "Event"},
        {id: 6, label: "The American Revolution", tSpans: ["1775-04-19", "1783-09-03"], class: "Event"},
        {id: 17, label: "California", tSpans: ["1849-01-01","2013-01-01"], class: "HistPeriod", rels: [7]}
        
    ],
    Relations: [
        { id: 0, subj: "None Listed", pred: "Participation", obj: "Event_0", src: "None Listed"},
        { id: 1, subj: "None Listed", pred: "Participation", obj: "Event_1", src: "None Listed"},
        { id: 2, subj: "None Listed", pred: "Participation", obj: "Event_2", src: "None Listed"},
        { id: 3, subj: "None Listed", pred: "Participation", obj: "Event_3", src: "None Listed"},
        { id: 4, subj: "None Listed", pred: "Participation", obj: "Event_4", src: "None Listed"},
        { id: 5, subj: "None Listed", pred: "Participation", obj: "Event_5", src: "None Listed"},
        { id: 6, subj: "None Listed", pred: "Participation", obj: "Event_6", src: "None Listed"},
        { id: 7, subj: "None Listed", pred: "contained_by", obj: "HistPeriod_7", src: "None Listed"},
        { id: 8, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_10", src: "None Listed"},
        { id: 9, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_15", src: "None Listed"},
        { id: 10, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_16", src: "None Listed"},
        { id: 11, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_13", src: "None Listed"}
        
    ]
    
}

someCountriesComplex = {
    type: "PeriodCollection",
    id: "0",
    label: "Some Countries in Karl JSON data format",
    rev_date: "1900-01-01",
    author: "Elijah Meeks",
    projection: {atom: "year", origin: "1800-01-01", datetype: "date", scale: 3},
    Features: [
        {id: 7, label: "United States of America", tSpans: [["1776-07-04", "1801-12-31"],["1803-04-11","1960-01-01"]], rels: [2,3,5,6], class: "HistPeriod"},
        {id: 8, label: "Confederate States of America", tSpans: ["1861-05-01", "1865-05-01"], rels: [5], class: "HistPeriod"},
        {id: 9, label: "Kingdom of France", tSpans: ["1453-01-01", "1789-12-31"], rels: [6], class: "HistPeriod"},
        {id: 10, label: "Republic of France", tSpans: ["1792-07-14", "2013-12-31"], rels: [0,1,2,3,8], class: "HistPeriod"},
        {id: 11, label: "The United Kingdom", tSpans: ["1707-05-01", "2013-12-31"], rels: [0,1,2,3,6], class: "HistPeriod"},
        {id: 12, label: "Imperial Russia", tSpans: ["1721-07-04", "1916-06-31"], rels: [2,11], class: "HistPeriod"},
        {id: 13, label: "Soviet Russia", tSpans: ["1916-07-01", "1991-12-31"], rels: [3], class: "HistPeriod"},
        {id: 14, label: "German Empire", tSpans: ["1871-01-01", "1918-12-31"], rels: [0,1,2,9], class: "HistPeriod"},
        {id: 15, label: "Weimar Republic", tSpans: ["1919-01-02", "1936-12-31"], rels: [10], class: "HistPeriod"},
        {id: 16, label: "Nazi Germany", tSpans: ["1937-01-02", "1945-12-31"], rels: [3], class: "HistPeriod"},
        {id: 0, label: "First Morroccan Crisis", tSpans: ["1905-03-01","1906-05-3"], class: "Event"},
        {id: 1, label: "Second Morroccan Crisis", tSpans: "1911-07-01", class: "Event"},
        {id: 2, label: "World War I", tSpans: ["1914-07-28", "1918-11-11"], class: "Event"},
        {id: 3, label: "World War II", tSpans: ["1939-09-01", "1945-05-08"], class: "Event"},
        {id: 4, label: "Assassination of Abraham Lincoln", tSpans: "1865-04-15", class: "Event"},
        {id: 5, label: "The American Civil War", tSpans: ["1861-04-12", "1865-05-10"], class: "Event"},
        {id: 6, label: "The American Revolution", tSpans: ["1775-04-19", "1783-09-03"], class: "Event"},
        {id: 17, label: "California", tSpans: ["1849-01-01","2013-01-01"], class: "HistPeriod", rels: [7]}
        
    ],
    Relations: [
        { id: 0, subj: "None Listed", pred: "Participation", obj: "Event_0", src: "None Listed"},
        { id: 1, subj: "None Listed", pred: "Participation", obj: "Event_1", src: "None Listed"},
        { id: 2, subj: "None Listed", pred: "Participation", obj: "Event_2", src: "None Listed"},
        { id: 3, subj: "None Listed", pred: "Participation", obj: "Event_3", src: "None Listed"},
        { id: 4, subj: "None Listed", pred: "Participation", obj: "Event_4", src: "None Listed"},
        { id: 5, subj: "None Listed", pred: "Participation", obj: "Event_5", src: "None Listed"},
        { id: 6, subj: "None Listed", pred: "Participation", obj: "Event_6", src: "None Listed"},
        { id: 7, subj: "None Listed", pred: "contained_by", obj: "HistPeriod_7", src: "None Listed"},
        { id: 8, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_10", src: "None Listed"},
        { id: 9, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_15", src: "None Listed"},
        { id: 10, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_16", src: "None Listed"},
        { id: 11, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_13", src: "None Listed"}
        
    ]
    
}

someCountriesInteger = {
    type: "PeriodCollection",
    id: "0",
    label: "Some Countries in Karl JSON data format",
    rev_date: "1900-01-01",
    author: "Elijah Meeks",
    projection: {atom: "year", origin: 1800, datetype: "integer", scale: 3},
    Features: [
        {id: 7, label: "United States of America", tSpans: [1776, 2013], rels: [2,3,5,6], class: "HistPeriod"},
        {id: 8, label: "Confederate States of America", tSpans: [1861, 1865], rels: [5], class: "HistPeriod"},
        {id: 9, label: "Kingdom of France", tSpans: [1453, 1789], rels: [6], class: "HistPeriod"},
        {id: 10, label: "Republic of France", tSpans: [1792, 2013], rels: [0,1,2,3,8], class: "HistPeriod"},
        {id: 11, label: "The United Kingdom", tSpans: [1707, 2013], rels: [0,1,2,3,6], class: "HistPeriod"},
        {id: 12, label: "Imperial Russia", tSpans: [1721, 1916], rels: [2,11], class: "HistPeriod"},
        {id: 13, label: "Soviet Russia", tSpans: [1916, "1991-12-31"], rels: [3], class: "HistPeriod"},
        {id: 14, label: "German Empire", tSpans: [1871, "1918-12-31"], rels: [0,1,2,9], class: "HistPeriod"},
        {id: 15, label: "Weimar Republic", tSpans: [1919, "1936-12-31"], rels: [10], class: "HistPeriod"},
        {id: 16, label: "Nazi Germany", tSpans: [1937, 1945], rels: [3], class: "HistPeriod"},
        {id: 0, label: "First Morroccan Crisis", tSpans: [1905,1906], class: "Event"},
        {id: 1, label: "Second Morroccan Crisis", tSpans: 1911, class: "Event"},
        {id: 2, label: "World War I", tSpans: [1914, 1918], class: "Event"},
        {id: 3, label: "World War II", tSpans: [1939, 1945], class: "Event"},
        {id: 4, label: "Assassination of Abraham Lincoln", tSpans: 1865, class: "Event"},
        {id: 5, label: "The American Civil War", tSpans: [1861, 1865], class: "Event"},
        {id: 6, label: "The American Revolution", tSpans: [1775, 1783], class: "Event"},
        {id: 17, label: "California", tSpans: [1849,2013], class: "HistPeriod", rels: [7]}
        
    ],
    Relations: [
        { id: 0, subj: "None Listed", pred: "Participation", obj: "Event_0", src: "None Listed"},
        { id: 1, subj: "None Listed", pred: "Participation", obj: "Event_1", src: "None Listed"},
        { id: 2, subj: "None Listed", pred: "Participation", obj: "Event_2", src: "None Listed"},
        { id: 3, subj: "None Listed", pred: "Participation", obj: "Event_3", src: "None Listed"},
        { id: 4, subj: "None Listed", pred: "Participation", obj: "Event_4", src: "None Listed"},
        { id: 5, subj: "None Listed", pred: "Participation", obj: "Event_5", src: "None Listed"},
        { id: 6, subj: "None Listed", pred: "Participation", obj: "Event_6", src: "None Listed"},
        { id: 7, subj: "None Listed", pred: "contained_by", obj: "HistPeriod_7", src: "None Listed"},
        { id: 8, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_10", src: "None Listed"},
        { id: 9, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_15", src: "None Listed"},
        { id: 10, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_16", src: "None Listed"},
        { id: 11, subj: "None Listed", pred: "followed_by", obj: "HistPeriod_13", src: "None Listed"}
        
    ]
    
}
