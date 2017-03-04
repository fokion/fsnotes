/**
 * Created by fokion on 01/03/2017.
 */
function SubscribedElement(){
    this.topic = "";
    this.cb;
}
function EventBroker() {
    var me = this;
    var topics = {};

    /**
     * [group.publish("Input/date/updated",[value,valid],this)]
     *
     * @param {String}
     *                topic
     * @param {Array}
     *                args (optional)
     * @param {Object}
     *                scope (optional)
     */
    me.publish = function (topic, args, scope) {
        if (topic in topics) {
            var message = topics[topic];
            var index = message.length;
            var delivedScope = (scope) ? scope : me;
            var deliveredArgs = (args) ? args : false;
            for (var i = 0; i < index; i++) {
                var handler = message[i];
                /*
                 * The apply() method calls a function with a given this value and
                 * arguments provided as an array (or an array-like object
                 */
                handler.apply(delivedScope, deliveredArgs);
            }
        }
    };
    /**
     * [group.subscribe("Input/date/updated",function(topic,args){...})]
     *
     * @param {String}
     *                topic
     * @param {Function}
     *                cb Function that will handle the event
     * @return {Array} Event handler
     */
    me.subscribe = function (topic, cb) {
        if (!(topic in topics)) {
            topics[topic] = [];
        }
        if (typeof cb === 'function') {
            topics[topic].push(cb);
            return new SubscribedElement(topic, cb);
        }
        return null;

    };
    /**
     * group.unsubscribe(SubscribedElement);
     *
     * @param {Object}
     *                SubscribedElement
     */
    me.unsubscribe = function (SubscribedElement) {
        var topic = SubscribedElement.topic;
        var message = topics[topic];
        var length = message.length;
        var cb = SubscribedElement.cb;
        for (var i = 0; i < length; i++) {
            if (message[i] === cb) {
                topics[topic].splice(topics[topic][i], 1);
            }
        }
    };

    me.publishTopicToId = function (id, topic) {
        return id + "::" + topic;
    };

}