/**
 * @template T
 *
 * @typedef {{
 *     get: () => T,
 *     set: (newValue: T | ((newValue: T) => T)) => void,
 *     subscribe: (newValue: T) => () => void,
 *     listen: (newValue: T) => () => void,
 * }} ReactiveTuple<T>
 */

/**
 * Subscribe function options
 * @typedef {{
 *     immidiate?: boolean
 * }} ReactiveSubscribeOptions
 */

/**
 * Options used in reactive function
 * @typedef {{
 *     persist?: {
 *         key: string
 *     }
 * }} ReactiveOptions
 */

/**
 * @template T
 * @param {T} initialValue
 * @param {ReactiveOptions} options
 * @returns {ReactiveTuple<T>}
 */
function reactive(initialValue, options = {}) {
	const subscribers = new Set();
	let persistedValue;
	const persistKey = options?.persist?.key ?? false;
	if (persistKey) {
		try {
			const rawData = localStorage.getItem(persistKey);
			if (rawData) {
				persistedValue = JSON.parse(rawData);
			}

		} catch (error) {
			persistedValue = null;
		}
	}

	const proxy = new Proxy({ value: persistedValue ?? initialValue }, {
		get(target, property) {
			return target[property];
		},
		set(target, property, newValue) {
			for (const subscriber of subscribers) {
				if (subscriber && subscriber instanceof Function) {
					subscriber(newValue);
				}
			}

			target[property] = newValue;
			if (persistKey) {
				try {
					const stringifiedValue = JSON.stringify(newValue);
					localStorage.setItem(persistKey, stringifiedValue);
				} catch (error) {
					console.error(`Unable to save data in localStorage with key '${persistKey}'`, newValue);
				}
			}
			return true;
		},
	});

	/**
	 * @param {(newValue: T) => void} cb
	 * @param {ReactiveSubscribeOptions?} options
	 * @return {(() => void)}
	 */
	const subscribe = (cb, options) => {
		if (!cb) {
			throw new Error('Callback cannot be empty');
		}

		if (!cb instanceof Function) {
			throw new Error('Callback is not a function');
		}

		const { immidiate } = options || {};

		immidiate && cb(proxy.value);
		subscribers.add(cb);

		return () => {
			subscribers.remove(cb);
		};
	};


	return {
		get() {
			return proxy.value;
		},
		/**
		 * @param {T} newValue
		 */
		set(newValue) {
			if (newValue instanceof Function) {
				proxy.value = newValue(proxy.value);
			} else {
				proxy.value = newValue;
			}
		},
		/**
		 * @param {(newValue: T) => void} cb
		 * @return {(() => void)}
		 */
		subscribe(cb) {
			return subscribe(cb, { immidiate: true });
		},
		/**
		 * @param {(newValue: T) => void} cb
		 * @return {(() => void)}
		 */
		listen(cb) {
			return subscribe(cb, { immidiate: false });
		},
	};
}
