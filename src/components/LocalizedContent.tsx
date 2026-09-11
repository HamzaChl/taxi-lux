import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const textOrigins = new WeakMap<Text, string>()
const attributeOrigins = new WeakMap<Element, Map<string, string>>()
const attributes = ['placeholder', 'aria-label', 'title', 'alt']

export function LocalizedContent() {
  const { t, i18n } = useTranslation()

  useEffect(() => {
    function translate(root: Node) {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
      let node = walker.nextNode()
      while (node) {
        const textNode = node as Text
        const current = textNode.nodeValue ?? ''
        const trimmed = current.trim()
        if (trimmed) {
          if (!textOrigins.has(textNode) || i18n.exists(trimmed, { lng: 'en' })) textOrigins.set(textNode, trimmed)
          const original = textOrigins.get(textNode) ?? trimmed
          const translated = t(original)
          if (translated !== original || i18n.language === 'fr') textNode.nodeValue = current.replace(trimmed, i18n.language === 'fr' ? original : translated)
        }
        node = walker.nextNode()
      }
      const elements = root instanceof Element ? [root, ...root.querySelectorAll('*')] : document.querySelectorAll('*')
      elements.forEach(element => {
        let origins = attributeOrigins.get(element)
        if (!origins) {
          origins = new Map()
          attributeOrigins.set(element, origins)
        }
        attributes.forEach(attribute => {
          const value = element.getAttribute(attribute)
          if (!value) return
          if (!origins.has(attribute)) origins.set(attribute, value)
          const original = origins.get(attribute) ?? value
          element.setAttribute(attribute, i18n.language === 'fr' ? original : t(original))
        })
      })
      document.documentElement.lang = i18n.language
    }

    translate(document.body)
    const observer = new MutationObserver(mutations => mutations.forEach(mutation => {
      if (mutation.type === 'characterData') translate(mutation.target)
      mutation.addedNodes.forEach(translate)
    }))
    observer.observe(document.body, { childList: true, characterData: true, subtree: true })
    return () => observer.disconnect()
  }, [i18n, i18n.language, t])

  return null
}
