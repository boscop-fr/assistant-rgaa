declare module 'frontmatter' {
	export default function frontmatter(markdown: string): {
		data: Record<string, string>;
		content: string;
	};
}
