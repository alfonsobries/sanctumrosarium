#!/bin/bash
# usage: strip.sh out.png img1 img2 ...
out="$1"; shift
args=(); f=""; i=0; l=""
for im in "$@"; do args+=(-i "$im"); f="$f[$i]scale=-1:900[v$i];"; l="$l[v$i]"; i=$((i+1)); done
ffmpeg -v error -y "${args[@]}" -filter_complex "${f}${l}hstack=$i" "$out"
