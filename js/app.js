$(function() {
    var get_player_details,
        render_player,
        get_nicerank,
        set_nicerank_node,
        get_target,
        player_images = {},
        get_player_ready,
        fight_button;

    get_target = function(num, mod) {
        return $("#js-player-" + num + "__" + mod);
    };

    player_images = {
        one: get_target("one", "avatar"),
        two: get_target("two", "avatar")
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

            username_node = get_target(num, "username");
            avatar_node   = player_images[num];

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
            get_target(num, "nicerank").html("" + (Math.round(resp.data[0].rank * 100) / 100));

            return $.Deferred().resolve(resp.data[0].rank);
        };
    };

    get_player_ready = function(name, num) {
        return get_player_details(name)
            .then(render_player(num))
            .then(get_nicerank)
            .then(set_nicerank_node(num));
    };

    fight_button = $("#js-fight-button");
    fight_button.on("click", function () {
        $.when(get_player_ready("ciarand", "one"), get_player_ready("rabryst", "two"))
            .then(function(nr1, nr2) {
                var winner = (nr1 > nr2) ? "one" : "two",
                    loser = (nr1 > nr2) ? "two" : "one";

                player_images[winner].animate({
                    width: 250
                }, 1500);

                player_images[loser].animate({
                    width: 100
                }, 1500);
            });

        $.map(player_images, function(obj) {
            //todo do something cool here
        });
    });
});
