test:
	npm test

build-image:test
	docker build -t game_sorter:latest .

up:
	docker run -p 3000:3000 game_sorter:latest