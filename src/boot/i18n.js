import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from 'src/i18n'
import extMessages from '../extensions/i18n'

Vue.use(VueI18n)

// Merge in the extension i18n files
for (let lang in messages) {
  if (extMessages[lang]) {
    messages[lang] = { ...messages[lang], ...extMessages[lang] }
  }
}

const i18n = new VueI18n({
  locale: 'en-us',
  fallbackLocale: 'en-us',
  messages
})

export default ({ app }) => {
  // Set i18n instance on app
  app.i18n = i18n
}

export { i18n }
