const normalizeUrl = require('normalize-url');

exports.run = async (bot, msg, args) => {
    let { leftover, options } = bot.utils.parseArgs(args, ['s:']);

    if (leftover.length < 1) {
        if (options.s) {
            throw 'You must provide a game as well as a stream URL.';
        }

        bot.user.setGame(null, null);
        return msg.edit('Cleared your game! :ok_hand:').then(m => m.delete(3000));
    }

    let game = leftover.join(' ');
    let stream = options.s;

    let fields = [{ name: ':video_game: Game', value: game }];

    if (stream) {
        stream = normalizeUrl(`twitch.tv/${stream}`);

        fields.push({ name: ':headphones: Stream URL', value: stream });
    }

    bot.user.setPresence({
        game: {
            name: game,
            url: stream,
            type: !!stream + 0 // pr0 hax0r -- convert string to truthy int
        }
    });

    msg.delete();

    (await msg.channel.send({
        embed: bot.utils.embed(':ok_hand: Game changed!', '', fields)
    })).delete(5000);
};

exports.info = {
    name: 'setgame',
    usage: 'setgame <game>',
    description: 'Sets your game (shows for other people)',
    options: [
        {
            name: '-s',
            usage: '-s <url>',
            description: 'Sets your streaming URL to http://twitch.tv/<url>'
        }
    ]
};
