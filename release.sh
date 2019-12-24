npm run build
rm -r ./docs/css
rm -r ./docs/img
rm -r ./docs/js
rm ./docs/precache-manifest.*.js
cp -r dist/* docs/
