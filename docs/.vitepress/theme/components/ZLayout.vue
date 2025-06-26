<template>
  <Layout v-bind="$attrs">
    <template v-if="comment && frontmatter.comment !== false" #doc-footer-before>
      <div class="doc-comments">
        <Giscus
          id="comments"
          mapping="specific"
          :term="pageId"
          strict="1"
          reactionsEnabled="1"
          emitMetadata="0"
          inputPosition="top"
          :theme="isDark ? 'dark' : 'light'"
          lang="zh-CN"
          loading="lazy"
          v-bind="{ ...comment }"
        />
      </div>
    </template>
  </Layout>
</template>
<script setup lang="ts">
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import Giscus from '@giscus/vue'
import { usePageId } from '../composables'
const { Layout } = DefaultTheme
const { theme, frontmatter, isDark } = useData()
const pageId = usePageId()
const { comment } = theme.value
</script>
<style scoped>
.doc-comments {
  margin-top: 24px;
  margin-bottom: 48px;
  border-top: 1px solid var(--vp-c-divider);
  padding-top: 24px;
}
</style>
