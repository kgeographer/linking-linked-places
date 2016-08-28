import json, os, re, codecs
wd='/users/karlg/Documents/Repos/Topotime/'
fn=wd+'data/incanto/i_sites.csv'
file = codecs.open(fn,"r",'utf-8')
nodes = file.readlines()[1:] #
file.close(); print(len(nodes))

# write a header

#fn = wd+'data/incanto_ids.csv'
#w1=open(fn,'w')
#w1.write('id,start,end,year,ships,days\n')

# write features

for x in range(len(nodes)): 
    arr = nodes[x].split("|")
    id = arr[0]
    placename = arr[1]
    label = arr[2]
    plid = arr[3]
    gnid = arr[4]
    geom = arr[5]
    notes = arr[6]
    print(placename)

w1.close()

## create an array with duplicates; easier to remove
#for i in xrange(len(rawa)):
    #next = rawa[i]; print next
    #q=[]
    #if next[1] == '"above"':
        #q.append([next[2][1:-1],'"below"','"'+next[0]+'"'])
        #if q[0] not in good and next not in good:
            #good.append(next)
    #elif next[1] == '"below"':
        #q.append([next[2][1:-1],'"above"','"'+next[0]+'"'])
        #if q[0] not in good and next not in good:
            #good.append(next)
    #elif next[1]=='"equal to"':
        #q.append([next[2][1:-1],'"equal to"','"'+next[0]+'"'])
        #if q[0] not in good and next not in good:
            #good.append(next)
    #else:
        #pass

#for g in good:
    #h=",".join(g)
    #w1.write(str(h).replace('"','')+'\n')
#w1.close();
    ##next = raw[x][:-1].split(';'); print next
    ##for y in xrange(len(good)):
        ##if (next[0] == good[y][2] and next[2] == good[y][0]):
            ##continue
        ##else:
            ##good.append(next); # print good;
    ###continue
    

## +++++++++++++++++++
##fn_e = 'c:/mydocs/__dhdev/citynature/imp_exp/h_edges_sig.txt'
###fn_a = wd+'h_array20.txt'
##w1=open(fn_e,'w')
###w2=open(fn_a,'w')
##w1.write('source\ttarget\tweight\n')
###w2.write('regionid\tsimhoods\n')
##missedcnt=0
##r1=re.compile(r'"(\d{6})"')
##r2=re.compile(r'"\d{6}:.*?"')
##r3=re.compile(r'\d{6}:')

##for x in xrange(len(raw)):
    ##try:
        ##regionid = r1.search(raw[x]).group()[1:-1] ; print regionid
        ##arr = r2.search(raw[x]).group()[1:-1] ; print arr
        ##array = arr.split(','); print array
        ##idarray = []
        ##for y in xrange(len(array)):
            ##t = array[y][:6]; print t
            ##idarray.append(int(t))
            ##w = array[y][7:]; print w
            ##w1.write(regionid+'\t'+t+'\t'+w+'\n')
        ###out=regionid+'\t{'+','.join(str(x) for x in idarray)[:]+'}\n'  ; out      
        ###w2.write(out)
    ##except:
        ##missedcnt +=1
        ##print 'something bad happened'
##w1.close()
##print 'missed '+ str(missedcnt)
###w2.close()