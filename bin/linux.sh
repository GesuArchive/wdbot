

echo "Hi, I’m ${SHELL}."
printf "Waiting for 5 seconds, press a key to continue ... "; read -t 5 -n 1 -s ; echo
exit $?

# https://stackoverflow.com/questions/17510688/single-script-to-run-in-both-windows-batch-and-linux-bash/27527230;

