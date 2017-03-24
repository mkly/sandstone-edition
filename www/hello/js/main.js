var websocketSession = null;

/**
 * Called when connected to chat server.
 *
 * @param {wampSession} session Object provided by autobahn to subscribe/publish/unsubscribe.
 */
function onSessionOpen(session) {
    websocketSession = session;

    setIndicator('websocket-connection', 'success', 'Connected to <code>'+session._wsuri+'</code>');

    // Subscribe to 'chat/general' topic
    session.subscribe('chat', function (topic, event) {
        console.log('message received', topic, event);

        setIndicator('chat-topic', 'success', 'Subscribed to chat topic.');
        addToChat(event.message);
    });

    // Publish a message to 'chat/general' topic
    session.publish('chat', 'Hello friend !');
}

/**
 * Called on error.
 *
 * @param {Integer} code
 * @param {String} reason
 * @param {String} detail
 */
function onError(code, reason, detail) {
    console.warn('error', code, reason, detail);

    setIndicator('websocket-connection', 'danger', [code, reason, detail].join(' ; '));
    setIndicator('chat-topic', 'danger', 'Needs websocket connection first');
}

// Connect to chat server
ab.connect(Environment.websocketServer, onSessionOpen, onError);

// Testing Rest Api
$.get(Environment.restApiUrl+'/hello')
    .then(function (response, text, metadata) {
        setIndicator('rest-api', 'success', 'Rest Api answered with <code>'+metadata.status+' '+metadata.statusText+'<br />'+metadata.responseText+'</code>');
    })
    .fail(function () {
        console.log(arguments);
        setIndicator('rest-api', 'danger', 'Error when trying to call <code>GET /api/hello</code>.');
    })
;
