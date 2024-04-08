export default function wait(ms: number) {
	return new Promise<void>((resolve) => setTimeout(() => resolve(), ms));
}
