export default class PubSub {
    events: { [key: string]: Function[]};
    constructor() {
        this.events = {};
    }
    /**
     * Either create a new event instance for passed `event` name
     * or push a new callback into the existing collection
     */
    subscribe(event: string, callback: Function): number {
        
        let self = this;
        
        // If there's not already an event with this name set in our collection
        // go ahead and create a new one and set it with an empty array, so we don't
        // have to type check it later down-the-line
        if(!self.events.hasOwnProperty(event)) {
            self.events[event] = [];
        }
        
        // We know we've got an array for this event, so push our callback in there with no fuss
        return self.events[event].push(callback);
    }

    /**
     * If the passed event has callbacks attached to it, loop through each one
     * and call it
     */
    publish(event: string, data = {}): Function[] {
        let self = this;
        
        // There's no event to publish to, so bail out
        if(!self.events.hasOwnProperty(event)) {
            return [];
        }
        
        // Get each subscription and call its callback with the passed data
        return self.events[event].map((callback: Function) => callback(data));
    }
}