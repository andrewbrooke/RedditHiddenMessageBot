# SecretMessageBot

Looks for Reddit posts with secret messages.

An example hidden message may look like this (first letter of each paragraph):

> Squirrels climb trees

> Everybody likes puppies

> Cats are also a great animal

> Rabbits are pretty cute too

> Elephants are big

> Turtles are slow

The hidden message is "SECRET"

## Installation

`npm i`

Create `.env` with the following:

```
DEBUG=reddit-secret-message-bot*
NODE_ENV=development
CLIENT_ID=***
CLIENT_SECRET==***
REDDIT_USER==***
REDDIT_PASS==***
```

## Running the bot

Hot reload with nodemon
`npm run dev`

Prod
`npm start`

## Testing

- Tests are written with Mocha and Chai
- Code coverage with nyc

Run tests with `npm test`

## Contributing

Feel free to add any new features or bug fixes with a fork and PR :)

Please follow the JS style standards in `.eslintrc.js`
