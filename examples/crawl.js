const Twit = require('twit');
const amqplib = require('amqplib');
const TAM = 200;

const T = new Twit({
    consumer_key: '...',
    consumer_secret: '...',
    access_token: '...',
    access_token_secret: '...'
});

const processTweets = async () => {
    const arrayTweets = [];

    const folha = await getUsersTweet('folha', TAM);
    const estadao = await getUsersTweet('Estadao', TAM);
    const globo = await getUsersTweet('oglobopolitica', TAM);

    const folhaFormatted = await formatTweet(folha);
    const estadaoFormatted = await formatTweet(estadao);
    const globoFormatted = await formatTweet(globo);

    for (let i = 0; i < TAM; i++) {
        arrayTweets.push(folhaFormatted[i]);
        arrayTweets.push(estadaoFormatted[i]);
        arrayTweets.push(globoFormatted[i]);
    }

    shuffleArray(arrayTweets);

    await sendMsg(arrayTweets);
}

const sendMsg = async (arrayTweets) => {
    const connection = await amqplib.connect('amqp://admin:admin@0.0.0.0:5672');
    const channel = await connection.createChannel();
    await channel.assertExchange('direct_tweets', 'direct', { durable: false });

    for (const tweet of arrayTweets) {
        const msg = tweet.text;
        const queue = tweet.screenName;

        channel.publish('direct_tweets', queue, Buffer.from(msg));
        console.log('Sent: ', msg);
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
            text: obj.text
        };
    });
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

processTweets();
