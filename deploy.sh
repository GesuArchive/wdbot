#!/bin/bash
# edit this shit as your server need

/home/ubuntu/repos/server_sigma #cd /home/tgstation/repos/repo_white/

mkdir -p \
    $1/_maps \
    $1/icons \
    $1/sound/chatter \
    $1/sound/voice/complionator \
    $1/sound/instruments \
    $1/strings

if [ -d ".git" ]; then
  mkdir -p $1/.git/logs
  cp -r .git/logs/* $1/.git/logs/
fi

cp tgstation.dmb tgstation.rsc $1/
cp -r _maps/* $1/_maps/
cp icons/default_title.dmi $1/icons/
cp -r sound/chatter/* $1/sound/chatter/
cp -r sound/voice/complionator/* $1/sound/voice/complionator/
cp -r sound/instruments/* $1/sound/instruments/
cp -r strings/* $1/strings/
