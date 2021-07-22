const PROP = '$_rootListeners';
const arrayIncludes = (array: any[], value: any) => array.indexOf(value) !== -1;

export default {
  created() {
    this[PROP] = {};
  },
  beforeDestroy() {
    // Unregister all registered listeners
    Object.keys(this[PROP] || {}).forEach((event) => {
      this[PROP][event].forEach((callback) => {
        this.listenOffRoot(event, callback);
      });
    });

    this[PROP] = null;
  },
  methods: {
    registerRootListener(event: string, callback: Function) {
      if (this[PROP]) {
        this[PROP][event] = this[PROP][event] || [];
        if (!arrayIncludes(this[PROP][event], callback)) {
          this[PROP][event].push(callback);
        }
      }
    },
    unregisterRootListener(event: string, callback: Function) {
      if (this[PROP] && this[PROP][event]) {
        this[PROP][event] = this[PROP][event].filter((cb) => cb !== callback);
      }
    },

    /**
     * Safely register event listeners on the root Vue node
     * While Vue automatically removes listeners for individual components,
     * when a component registers a listener on `$root` and is destroyed,
     * this orphans a callback because the node is gone, but the `$root`
     * does not clear the callback
     *
     * When registering a `$root` listener, it also registers the listener
     * to be removed in the component's `beforeDestroy()` hook
     */
    listenOnRoot(event: string, callback: Function) {
      if (this.$root) {
        this.$root.$on(event, callback);
        this.registerRootListener(event, callback);
      }
    },

    /**
     * Safely register a `$once()` event listener on the root Vue node
     * While Vue automatically removes listeners for individual components,
     * when a component registers a listener on `$root` and is destroyed,
     * this orphans a callback because the node is gone, but the `$root`
     * does not clear the callback
     *
     * When registering a `$root` listener, it also registers the listener
     * to be removed in the component's `beforeDestroy()` hook
     */
    listenOnRootOnce(event: string, callback: Function) {
      if (this.$root) {
        const _callback = (...args) => {
          this.unregisterRootListener(_callback);
          // eslint-disable-next-line node/no-callback-literal
          callback(...args);
        };

        this.$root.$once(event, _callback);
        this.registerRootListener(event, _callback);
      }
    },

    /**
     * Safely unregister event listeners from the root Vue node
     */
    listenOffRoot(event: string, callback: Function) {
      this.unregisterRootListener(event, callback);

      if (this.$root) {
        this.$root.$off(event, callback);
      }
    },

    /**
     * Convenience method for calling `vm.$emit()` on `$root`
     */
    emitOnRoot(event: string, ...args: any) {
      if (this.$root) {
        this.$root.$emit(event, ...args);
      }
    },
  },
};
