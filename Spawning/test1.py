import sys
for line in iter(sys.stdin.readline, ''):
    print "got: %s" % line
    sys.stdout.flush()
