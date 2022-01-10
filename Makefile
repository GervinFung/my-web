start-dev:
	cd frontend && yarn start & cd backend && yarn start-dev

start:
	cd backend && yarn start

build-dev:
	cd backend && yarn build-dev & cd frontend && yarn build-dev

build:
	cd backend && yarn build & cd frontend && yarn build

clean:
	cd backend && yarn clean & cd frontend && yarn clean

install-both:
	cd frontend && yarn & cd backend && yarn
