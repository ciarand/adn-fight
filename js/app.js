$(function() {
    var get_player_details,
        render_player,
        get_nicerank,
        set_nicerank_node,
        get_target,
        players = {},
        player_images = {},
        get_player_ready,
        get_ready,
        fight_button,
        reset_button;

    get_target = function(num, mod) {
        return $("#js-player-" + num + "__" + mod);
    };

    players.one = {
        nodes: {
            avatar: get_target("one", "avatar"),
            username: get_target("one", "username"),
            username_input: get_target("one", "username-input"),
            nicerank: get_target("one", "nicerank")
        }
    };

    players.two = {
        nodes: {
            avatar: get_target("two", "avatar"),
            username: get_target("two", "username"),
            username_input: get_target("two", "username-input"),
            nicerank: get_target("two", "nicerank")
        }
    };


    get_player_details = function(p) {
        return $.ajax({
            url: "https://api.app.net/users/@" + p,
            dataType: "json",
            type: "GET"
        });
    };

    render_player = function(num) {
        return function(resp) {
            var data = resp.data,
                username_node,
                avatar_node,
                promise = $.Deferred();

            username_node = players[num].nodes.username;
            avatar_node   = players[num].nodes.avatar;

            username_node.html(data.username);
            avatar_node.attr('src', data.avatar_image.url);

            return promise.resolve(resp);
        };
    };

    get_nicerank = function(resp) {
        return $.ajax({
            url: "http://api.nice.social/user/nicerank?ids=" + resp.data.id,
            //url: "/api/nicerank/" + id,
            crossDomain: true,
            dataType: "json",
            type: "GET"
        });
    };

    set_nicerank_node = function(num) {
        return function(resp) {
            players[num].nodes.nicerank.html("" + (Math.round(resp.data[0].rank * 100) / 100));

            return $.Deferred().resolve(resp.data[0].rank);
        };
    };

    get_player_ready = function(name, num) {
        return get_player_details(name)
            .then(render_player(num))
            .then(get_nicerank)
            .then(set_nicerank_node(num));
    };

    get_ready = function() {
        var name_one = players.one.nodes.username_input.val(),
            name_two = players.two.nodes.username_input.val();

        players.one.nodes.avatar.attr("style", "");
        players.two.nodes.avatar.attr("style", "");

        return $.when(get_player_ready(name_one, "one"), get_player_ready(name_two, "two"));
    };

    fight_button = $("#js-fight-button");
    reset_button = $("#js-reset-button");

    fight_button.on("click", function () {
        get_ready().then(function(nr1, nr2) {
            var winner = (nr1 > nr2) ? "one" : "two",
                loser = (nr1 > nr2) ? "two" : "one"

            players[winner].nodes.avatar
                .addClass("winner")
                .removeClass("spinning")
                .animate({
                    width: 250,
                    height: 250
                }, 1500);

            players[loser].nodes.avatar
                .addClass("loser")
                .removeClass("spinning")
                .animate({
                    opacity: .7,
                    padding: "3em"
                }, 1500);
        });

        //fight_button.addClass("disabled");
        //fight_button.prop("disabled", true);
    });
});
