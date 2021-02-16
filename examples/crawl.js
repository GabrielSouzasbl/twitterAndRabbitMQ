const Twit = require('twit');

const T = new Twit({
    consumer_key: '.',
    consumer_secret: '.',
    access_token: '.',
    access_token_secret: '.'
});

const arrayTweets = [];
const TAM = 200;

exports.execute = async (usersArray, amount) => {
    for (const user of usersArray) {
        await processTweets(user, amount);
    }

    shuffleArray(arrayTweets);

    return arrayTweets;
}

const processTweets = async (screenName, amount) => {
    amount = amount ? amount : TAM;

    const tweets = await getUsersTweet(screenName, amount);    
    const formatted = await formatTweet(tweets);

    for (let i = 0; i < amount; i++) {
        arrayTweets.push(formatted[i]);
    }
}

const getUsersTweet = (screenName, count) => {
    return new Promise((resolve, reject) => {
        let params = { screen_name: screenName, count: count }

        const callback = (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        };

        T.get('statuses/user_timeline', params, callback);
    });
}

const formatTweet = async (tweets) => {
    return tweets.map(obj => {
        return {
            date: new Date(obj.created_at).toLocaleDateString(),
            userId: obj.id,
            screenName: obj.user.screen_name,
            name: obj.user.name,
            text: cleanText(obj.text).split('http')[0] + `(${obj.user.screen_name})`
        };
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function cleanText(text) {
    if (!text) {
        return null;
    }
    // eslint-disable-next-line no-control-regex
    return text.normalize('NFD').replace(/[^\u0009|\u000A|\u000D|\u0020-\u007E|\u0085|\u00A0-\u00FF]/g, '').replace(/[^a-z0-9 _-]/gi, '').toLowerCase();
}
