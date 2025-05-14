import { type DefaultTheme } from "vitepress";

export default function searchOptions(): Partial<DefaultTheme.AlgoliaSearchOptions> {
	return {
		placeholder: '搜索文档',
		// noResultsText: '没有找到结果',
	};
}
