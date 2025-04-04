build: clean
	echo "Building theme"

	echo "Theme built successfully!"
	echo "Collect theme dist"
	rm -rf dist
	mkdir dist
	cp -r templates dist
	cp theme.yaml settings.yaml README.md dist
	zip -r dist.zip ./dist


clean:
	echo "Clean dist folder"
	rm -rf dist
	rm -rf dist.zip
