echo "insec{j4v4scr1pt_w4s_4_g00d_id34_??}" >> /flag.txt;

a() {
  node app.js &
  sleep 60;
  kill -9 `pgrep node`;
  echo "RESTART !";
  a;
}

a;
