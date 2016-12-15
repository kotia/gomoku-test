/**
 * Created by eugene on 10.12.16.
 */
let host = location.origin.replace(/^http/, 'ws');

export const socket = io.connect(host, {
    transports: ["polling", "websocket"]
});