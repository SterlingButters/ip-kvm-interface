# http://www.zerorpc.io/
import zerorpc

c = zerorpc.Client()
c.connect("tcp://127.0.0.1:4242")

while True:
    print(c.test())
