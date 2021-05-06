tsc;
nexe -i app.js -r "./node_modules" -r "./src" -o PrinterBot -t linux-x64-14.15.3;
tsc -b . --clean;