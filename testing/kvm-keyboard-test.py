#!/usr/bin/env python3

NULL_CHAR = chr(0)


def write_report(report):
    with open('/dev/hidg1', 'rb+') as fd:
        fd.write(report.encode())


# H (press shift and H)
write_report(chr(32)+NULL_CHAR+chr(11)+NULL_CHAR*5)

# e
write_report(NULL_CHAR*2+chr(8)+NULL_CHAR*5)

# ll
write_report(NULL_CHAR*2+chr(15)+NULL_CHAR*5)
write_report(NULL_CHAR*8)
write_report(NULL_CHAR*2+chr(15)+NULL_CHAR*5)

# o
write_report(NULL_CHAR*2+chr(18)+NULL_CHAR*5)

# SPACE
write_report(NULL_CHAR*2+chr(44)+NULL_CHAR*5)

# W (press shift and W)
write_report(chr(32)+NULL_CHAR+chr(26)+NULL_CHAR*5)

# o
write_report(NULL_CHAR*2+chr(18)+NULL_CHAR*5)

# r
write_report(NULL_CHAR*2+chr(21)+NULL_CHAR*5)

# l
write_report(NULL_CHAR*2+chr(15)+NULL_CHAR*5)

# d
write_report(NULL_CHAR*2+chr(7)+NULL_CHAR*5)

# ! (press shift and 1)
write_report(chr(32)+NULL_CHAR+chr(30)+NULL_CHAR*5)

# Release all keys
write_report(NULL_CHAR*8)
