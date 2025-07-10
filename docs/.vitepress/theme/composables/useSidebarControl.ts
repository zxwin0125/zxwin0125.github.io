import { ref, computed, watch, watchEffect, watchPostEffect, onMounted } from 'vue'
import { useData } from 'vitepress'
const HASH_RE = /#.*$/
const HASH_OR_QUERY_RE = /[?#].*$/
const INDEX_OR_EXT_RE = /(?:(^|\/)index)?\.(?:md|html)$/
const inBrowser = typeof document !== 'undefined'

function normalize(path: string) {
  return decodeURI(path).replace(HASH_OR_QUERY_RE, '').replace(INDEX_OR_EXT_RE, '$1')
}

function isActive(currentPath: string, matchPath: string, asRegex = false) {
  if (matchPath === undefined) {
    return false
  }
  currentPath = normalize(`/${currentPath}`)
  if (asRegex) {
    return new RegExp(matchPath).test(currentPath)
  }
  if (normalize(matchPath) !== currentPath) {
    return false
  }
  const hashMatch = matchPath.match(HASH_RE)
  if (hashMatch) {
    return (inBrowser ? location.hash : '') === hashMatch[0]
  }
  return true
}

function containsActiveLink(path: string, items: any): boolean {
  if (Array.isArray(items)) {
    return items.some(item => containsActiveLink(path, item))
  }
  return (
    isActive(path, items.link) ? true
    : items.items ? containsActiveLink(path, items.items)
    : false
  )
}

export function useSidebarControl(item: any) {
  const { page, hash } = useData()
  const collapsed = ref(false)
  const collapsible = computed(() => {
    return item.value.collapsed != null
  })
  const isLink = computed(() => {
    return !!item.value.link
  })
  const isActiveLink = ref(false)
  const updateIsActiveLink = () => {
    isActiveLink.value = isActive(page.value.relativePath, item.value.link)
  }
  watch([page, item, hash], updateIsActiveLink)
  onMounted(updateIsActiveLink)
  const hasActiveLink = computed(() => {
    if (isActiveLink.value) {
      return true
    }
    return item.value.items ? containsActiveLink(page.value.relativePath, item.value.items) : false
  })
  const hasChildren = computed(() => {
    return !!(item.value.items && item.value.items.length)
  })
  watchEffect(() => {
    collapsed.value = !!(collapsible.value && item.value.collapsed)
  })
  watchPostEffect(() => {
    ;(isActiveLink.value || hasActiveLink.value) && (collapsed.value = false)
  })
  function toggle() {
    if (collapsible.value) {
      collapsed.value = !collapsed.value
    }
  }
  return {
    collapsed,
    collapsible,
    isLink,
    isActiveLink,
    hasActiveLink,
    hasChildren,
    toggle
  }
}
