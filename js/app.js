// look, I don't like protypical inheritance ok
window.ENV = {};
ENV.EXTEND_PROTOTYPES = false;

window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.Router.map(function() {
    // noop
});

App.IndexRoute = Ember.Route.extend({
      model: function() {
          return this.store.findAll("user");
      }
});

App.Store = DS.Store.extend({
    adapter: App.UserAdapter
});

App.User = DS.Model.extend({
    canonicalUrl:  DS.attr("string"),
    name:          DS.attr("string"),
    username:      DS.attr("string"),
    avatarUrl:     DS.attr("string"),
    description:   DS.attr("string"),
    niceRank:      DS.belongsTo("nicerank", {})
});

App.Nicerank = DS.Model.extend({
    rank:      DS.attr("number"),
    isHuman:   DS.attr("boolean"),
    user:      DS.belongsTo("user", {})
});

App.UserAdapter = DS.RESTAdapter.extend({
    namespace: "api"
});

App.UserSerializer = DS.RESTSerializer.extend({
    extract: function (store, type, payload, id, requestType) {
        // just grab the "data" key out
        return this._super(store, type, {"users": payload.data}, id, requestType);
    },
    normalize: function (type, hash, prop) {
        hash = {
            id:            hash.id,
            canonicalUrl:  hash.canonical_url,
            name:          hash.name,
            username:      hash.username,
            avatarUrl:     hash.avatar_image.url,
            description:   hash.description.html,
            niceRank:      App.User.store.find("nicerank", hash.id)
        };

        debugger;
        return hash;
    }
});

App.NicerankAdapter = DS.RESTAdapter.extend({
    namespace: "user/nicerank",
    host: "http://api.search-adn.net",
    buildURL: function (type, id) {
        return this._super(type, "?ids=" + id);
    }
});

App.NicerankSerializer = DS.RESTSerializer.extend({
    extract: function (store, type, payload, id, requestType) {
        // just grab the "data" key out
        return this._super(store, type, {"niceranks": payload.data}, id, requestType);
    },
    normalize: function (type, hash, prop) {
        hash = {
            id: hash.user_id,
            rank: hash.rank,
            isHuman: hash.is_human
        };

        return hash;
    }
});
