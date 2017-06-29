require('dotenv').config();
const debug = require('debug')(process.env.DEBUG + ':app');

const pjson = require('./package.json');
const Snoowrap = require('snoowrap');
const Snoostorm = require('snoostorm');
const words = require('check-word')('en');

const MIN_WORD_LENGTH = 4;

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

const streamOpts = {
    subreddit: 'all',
    results: 25
};

const submissions = client.SubmissionStream(streamOpts); // eslint-disable-line
submissions.on('submission', postResult);

const comments = client.CommentStream(streamOpts); // eslint-disable-line
comments.on('comment', postResult);

/**
 * Checks if a given Reddit Submission or Comment contains a "Secret Message"
 * @param  {Object} post A Snoowrap Submission or Comment to check for a secret message
 */
function checkSecretMessage(post) {
    let isSubmission = post.constructor.name === 'Submission';

    let paragraphs = post[isSubmission ? 'selftext' : 'body'].split('\n\n');
    let firstChars = paragraphs.map((p) => p.charAt(0));
    let firstLetters = firstChars.filter((c) => {
        return c.match(/[A-Za-z0-9]/i);
    });
    let word = firstLetters.join('').toLowerCase();
    let isValidWord = words.check(word) && word.length > MIN_WORD_LENGTH;

    debug(post.author.name);
    if (isValidWord) {
        debug(`Found a secret word: ${post.id} - ${word}`);
        replyToPost(post, word);
    }
}

/**
 * Replies to the Reddit Submission or Comment with a bot message
 * @param  {Object} post A Snoowrap Submission or Comment to reply to
 * @param  {String} word The secret message
 */
function replyToPost(post, word) {
    let isSubmission = post.constructor.name === 'Submission';
    const reply = `
This ${isSubmission ? 'submission' : 'comment'} contains a secret message!\n\n
The secret message is: **${word}**\n\n\n\n
^^Bot ^^[source](${pjson.homepage}) ^^| ^^Please ^^report ^^issues ^^[here](${pjson.bugs.url})
    `;
    post.reply(reply);
}
