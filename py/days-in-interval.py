N = 4
k = 1


def inInterval(day):
   num = min(day, N-k+1) - max(1, day-k+1) + 1
   denom = N - k + 1
   return num/denom





#min(i,N−k+1) − max(1,i−k+1) + 1 / N−k+1

