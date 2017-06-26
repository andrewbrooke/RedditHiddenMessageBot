require('dotenv').config();
const debug = require('debug')(process.env.DEBUG + ':app');

const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const words = require('check-word')('en');

// Configure API request object
const r = new Snoowrap({
    userAgent: 'reddit-hidden-message-bot',
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    username: process.env.REDDIT_USER,
    password: process.env.REDDIT_PASS
});
const client = new Snoostorm(r);

let postResult = (post) => {
    checkSecretMessage(post);
};

const submissions = client.SubmissionStream(); // eslint-disable-line
submissions.on('submission', postResult);

const comments = client.CommentStream(); // eslint-disable-line
comments.on('comment', postResult);

/**
 * Checks if a given Reddit Submission or Comment contains a "Secret Message"
 * @param  {Object} post A Snoowrap Submission or Comment
 */
function checkSecretMessage(post) {
    let isSubmission = post.constructor.name === 'Submission';

    let paragraphs = post[isSubmission ? 'selftext' : 'body'].split('\n\n');
    let firstChars = paragraphs.map((p) => p.charAt(0));
    let firstLetters = firstChars.filter((c) => {
        return c.match(/[A-Za-z0-9]/i);
    });
    let word = firstLetters.join('').toLowerCase();
    let isValidWord = words.check(word);
    debug(post.id, word, isValidWord);

    if (isValidWord) {
        // TODO: reply to Submission or Comment
    }
}
