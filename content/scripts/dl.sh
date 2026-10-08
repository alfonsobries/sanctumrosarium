#!/bin/bash
# usage: dl.sh <dir> name url [name url ...]
dir="$1"; shift
mkdir -p "$dir"
while [ $# -gt 1 ]; do
  n="$1"; u="$2"; shift 2
  tmp="$dir/$n.webp"
  curl -sfL "$u" -o "$tmp" && sips -s format png "$tmp" --resampleHeight 1400 --out "$dir/$n.png" >/dev/null 2>&1 && rm "$tmp" || echo "fail $n"
done
ls "$dir" | wc -l
