# Ads Writeup

This was supposed to be a very easy challenge, cuz the flag was penetrating everyone for the whole CTF (13 hours) xD.

- Just open wireshark and sniff the `bluetooth-monitor` interface.
- Then open a terminal and run `sudo hcitool lescan --duplicates`
- Look for data that starts with `insec`
- Now filter based on the sender bluetooth mac addr
- You will see the flag split in 4 parts :D 

FLAG: `insec{BRUH_I_l1t3r4lly_h4v3_n0_id34_wh4t_t0_put_h3r3}`
