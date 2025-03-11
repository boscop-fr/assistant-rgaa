export const omit = <T, K extends keyof T>(object: T, keys: K[]) =>
	Object.fromEntries(
		(Object.entries(object) as Array<[key: K, value: unknown]>).filter(
			([key]) => !keys.includes(key)
		)
	) as Pick<T, K>;
