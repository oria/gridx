@echo off

cd js-doc-parse
node autoparse.js

cd ../api
node buildall.js

cd ..
pause
