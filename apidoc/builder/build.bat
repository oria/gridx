@echo off

cd js-doc-parse
node autoparse.js
pause

cd ../api
node buildall.js

cd ..
pause
