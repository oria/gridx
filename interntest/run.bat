cd /d %~dp0
cd ..
node node_modules/intern/runner.js config=interntest/intern 1> interntest/log.txt 2> interntest/err.txt
