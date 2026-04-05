#!/bin/bash
cd "$(dirname "$0")"

echo "=== PLACEHOLDER CHECK (SITE FILES ONLY) ==="
grep -nH "hello@cinemamachina.com\|+971 XX XXX XXXX\|971000000000" *.html assets/css/*.css assets/js/*.js || true
echo

echo "=== PRODUCTION CONTACT CHECK ==="
grep -nH "cinemamachina.ae@gmail.com\|971507282195\|wa.me/971507282195" *.html assets/css/*.css assets/js/*.js || true
echo

echo "=== VIMEO INLINE CHECK ==="
grep -nH "playsinline=1" *.html || true
echo

echo "=== DS_STORE CHECK ==="
find . -name ".DS_Store"
