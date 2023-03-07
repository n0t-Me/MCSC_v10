const express = require("express");
const chance = require("chance");
const { exec } = require('child_process');
const app = express();

app.use(express.json());

const rng = chance();

const isObj = (i) => (typeof i === 'object');

const encStr = (msg, key) => {
  const bMsg = Buffer.from(msg);
  const res = Buffer.alloc(bMsg.length);
  for (let i = 0; i < bMsg.length; i++) {
    res[i] = bMsg[i] ^ key;
  }
  return res.toString();
}

const encObjIn = (obj, dst, k) => {
  for (let key in obj) {
    let encKey = btoa(encStr(key, k));
    if (isObj(obj[key])) {
      encObjIn(obj[key], dst[encKey], k);
    } else {
      dst[encKey] = btoa(encStr(obj[key], k));
    }
  }
  return dst
}

const decObjIn = (obj, dst, k) => {
  for (let key in obj) {
    let decKey = encStr(atob(key), k);
    if (isObj(obj[key])) {
      decObjIn(obj[key], dst[decKey], k);
    } else {
      dst[decKey] = encStr(atob(obj[key]), k);
    }
  }
  return dst
}

const logObj = (obj, k) => {
  const e = decObjIn(obj, {}, k);
  exec("echo " + k + "," + btoa(JSON.stringify(e)) + " >> app_logs && head -n20 app_logs | tee app_logs");
}

app.post('/', (req, res) => {
  const k = rng.integer({min: 1, max: 10});
  try {
    const d = atob(req.body.json);
    logObj(JSON.parse(d), k);
    res.send("<h1>OK</h1>");
    res.status(200);
  } catch(e) {
    console.log(e);
    res.send("<h1>I'm a teapot :P</h1>");
    res.status(418);
  }
});

app.listen(3030, () => {
  console.log("APP IS LISTENING ON PORT 3030 !")
})
