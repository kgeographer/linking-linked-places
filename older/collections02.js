mixedBag01 = {
    type: "PeriodCollection",
    id: "0", label: "Integration attempt",
    rev_date: "2013-09-22", author: ["EM", "KG"],
    projection: {atom: "year", origin: "1707-05-01", datetype: "date", scale: 3},
    Periods: [
        {id: 0, label: "First Morroccan Crisis", tSpans: ["1905-03-01","1906-05-3"], class: "Event"},
        {id: 1, label: "Second Morroccan Crisis", tSpans: "1911-07-01", class: "Event"},
        {id: 2, label: "World War I", tSpans: ["1914-07-28", "1918-11-11"], class: "Event"},
        {id: 3, label: "World War II", tSpans: ["1939-09-01", "1945-05-08"], class: "Event"},
        {id: 4, label: "Assassination of Abraham Lincoln", tSpans: "1865-04-15", class: "Event"},
        {id: 5, label: "The American Civil War", tSpans: ["1861-04-12", "1865-05-10"], class: "Event"},
        {id: 6, label: "The American Revolution", tSpans: ["1775-04-19", "1783-09-03"], class: "Event"},
        
        {id: 7, label: "United States of America", tSpans: ["1776-07-04", "2013-12-31"], rels: [7,12,29,30], class: "HistPeriod"},
        {id: 8, label: "Confederate States of America", tSpans: ["1861-05-01", "1865-05-01"], rels: [12,30], class: "HistPeriod"},
        {id: 9, label: "Kingdom of France", tSpans: ["1453-01-01", "1789-12-31"], rels: [8], class: "HistPeriod"},
        {id: 10, label: "Republic of France", tSpans: ["1792-07-14", "2013-12-31"], rels: [8], class: "HistPeriod"},
        {id: 11, label: "The United Kingdom", tSpans: ["1707-05-01", "2013-12-31"], rels: [], class: "HistPeriod"},
        {id: 12, label: "Imperial Russia", tSpans: ["1721-07-04", "1916-06-31"], rels: [11], class: "HistPeriod"},
        {id: 13, label: "Soviet Russia", tSpans: ["1916-07-01", "1991-12-31"], rels: [11], class: "HistPeriod"},
        {id: 14, label: "German Empire", tSpans: ["1871-01-01", "1918-12-31"], rels: [9], class: "HistPeriod"},
        {id: 15, label: "Weimar Republic", tSpans: ["1919-01-02", "1936-12-31"], rels: [9,10], class: "HistPeriod"},
        {id: 16, label: "Nazi Germany", tSpans: ["1937-01-02", "1945-12-31"], rels: [10], class: "HistPeriod"},
        {id: 17, label: "California", tSpans: ["1849-01-01","2013-01-01"], class: "HistPeriod", rels: [7]},
        
        {id: 18, label: "Bob Jones", tSpans: ["1895-09-01", "1945-05-08"], class: "Lifespan", rels: [22,23,24]},
        {id: 19, label: "Mary Childbride Jones", tSpans: ["1901-06-22", "1945-06-09"], class: "Lifespan", rels: [22,23]},        
        {id: 20, label: "Margaret Vixen", tSpans: ["1904-06-25", "1953-06-21"], class: "Lifespan", rels: [24]},
        {id: 21, label: "Lin Jones", tSpans: ["1941-04-19", "1973-01-01"], class: "Lifespan", rels: [24]},
        {id: 22, label: "Marriage of Bob and Mary", tSpans: "1915-09-15", class: "Event"},
        {id: 23, label: "Divorce of Bob and Mary", tSpans: "1944-04-19", class: "Event"},
        {id: 24, label: "Birth of Lin Jones", tSpans: "1941-04-19", class: "Event"}
        
        // could add archaeological contexts (layers) here in principle, with topological relations of <, =, or >
    ],
    Relations: [
        { id: 7, rel: ["P17","part-of","P7"], src: "None Listed"}, // Cali lifespan part-of US lifespan
        { id: 29, rel: ["P5","part-of","P7"], src: "None Listed"}, // Civil War part-of US lifespan
        { id: 30, rel: ["P8","part-of","P7"], src: "None Listed"}, // Confederacy part-of US lifespan
        // Topological
        { id: 8, rel: ["P9","m","P10"], src: "None Listed"}, // K of Fr meets R of Fr
        { id: 9, rel: ["P14","m","P15"], src: "None Listed"}, // Ger Emp meets Weimar
        { id: 10, rel: ["P16","mi","P15"], src: "None Listed"}, // Nazi met by Weimer
        { id: 11, rel: ["P12","m","P13"], src: "None Listed"}, // Imp Rus meets Sov Rus
        { id: 12, rel: ["P8","d","P7"], src: "None Listed"}, // Confed during USA
        // Wars
        { id: 0, rel: ["A3","participated-in","P0"], prop: {role: "combatant"}, src: "None Listed"}, 
        { id: 1, rel: ["A4","participated-in","P0"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 2, rel: ["A7","participated-in","P0"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 3, rel: ["A3","participated-in","P1"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 4, rel: ["A4","participated-in","P1"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 5, rel: ["A7","participated-in","P1"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 6, rel: ["A3","participated-in","P2"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 13, rel: ["A4","participated-in","P2"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 14, rel: ["A7","participated-in","P2"], prop: {role: "combatant"}, src: "None Listed"},
        // WW II
        { id: 15, rel: ["A0","participated-in","P3"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 16, rel: ["A3","participated-in","P3"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 17, rel: ["A4","participated-in","P3"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 18, rel: ["A6","participated-in","P3"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 19, rel: ["A9","participated-in","P3"], prop: {role: "combatant"}, src: "None Listed"},
        // Civil War
        { id: 28, rel: ["A0","participated-in","P5"], prop: {role: "combatant"}, src: "None Listed"},
        { id: 29, rel: ["A1","participated-in","P5"], prop: {role: "combatant"}, src: "None Listed"},
        // Lincoln
        { id: 20, rel: ["A15","participated-in","P4"], prop: {role: "victim"}, src: "None Listed"},
        { id: 28, rel: ["A15","participated-in","P5"], prop: {role: "commander-in-chief"}, src: "None Listed"}, 
        // Soap opera
        { id: 21, rel: ["A11","participated-in","E22"], prop: {role: "spouse"},  src: "None Listed"},
        { id: 22, rel: ["A12","participated-in","E22"], prop: {role: "spouse"},  src: "None Listed"},
            // birth of Lin
        { id: 23, rel: ["A11","participated-in","E24"], prop: {role: "father"},  src: "None Listed"},
        { id: 24, rel: ["A13","participated-in","E24"], prop: {role: "mother"},  src: "None Listed"},
        { id: 25, rel: ["A14","participated-in","E24"], prop: {role: "birthee"},  src: "None Listed"},
            // divorce
        { id: 26, rel: ["A11","participated-in","E23"], prop: {role: "spouse"},  src: "None Listed"},
        { id: 27, rel: ["A12","participated-in","E23"], prop: {role: "spouse"},  src: "None Listed"}
             
    ],
    Actors: [
        {id: 0, label: "United States of America", rels: [15,28], type: "Country"},
        {id: 1, label: "Confederate States of America", rels: [29], type: "Country"},
        {id: 2, label: "Kingdom of France", rels: [ ], type: "Country"},
        {id: 3, label: "Republic of France", rels: [0,3,6,16], type: "Country"},
        {id: 4, label: "The United Kingdom", rels: [1,4,13,17], type: "Country"},
        {id: 5, label: "Imperial Russia", rels: [ ], type: "Country"},
        {id: 6, label: "Soviet Russia", rels: [18], type: "Country"},
        {id: 7, label: "German Empire", rels: [2,5,14], type: "Country"},
        {id: 8, label: "Weimar Republic", rels: [ ], type: "Country"},
        {id: 9, label: "Nazi Germany", rels: [19], type: "Country"},
        {id: 10, label: "California", rels: [ ], type: "Admin1"},
        {id: 11, label: "Bob Jones", type: "Person", rels: [21,23,26]},
        {id: 12, label: "Mary Childbride Jones", type: "Person", rels: [22,27]},        
        {id: 13, label: "Margaret Vixen", type: "Person", rels: [24]},
        {id: 14, label: "Lin Jones", type: "Person", rels: [25]},
        {id: 15, label: "Abraham Lincoln", type: "Person", rels: [20,28] }
    ]
    
}
