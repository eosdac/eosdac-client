<template>
  <div class="full-width">
    <div
      v-if="!edit"
      v-html="convertedAndSanitizedHtml"
      class="markdown-body q-body-ow"
    ></div>
    <div v-else class="relative-position bg-bg2 round-borders">
      <q-field :label="label" stack-label>
        <template v-slot:control>
          <div class="self-center full-width no-outline" tabindex="0">
            <textarea ref="editor_replace"></textarea>
          </div>
        </template>
      </q-field>
    </div>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
import marked from 'marked'
import TurndownService from 'turndown'
import SimpleMDE from 'simplemde'
const turndownService = new TurndownService()

const renderer = new marked.Renderer()
renderer.link = function (href, title, text) {
  let link = marked.Renderer.prototype.link.apply(this, arguments)
  return link.replace('<a', "<a target='_blank'")
}

marked.setOptions({
  renderer: renderer
})

export default {
  name: 'MarkdownViewer',
  props: {
    text: String,
    label: String,
    dark: Boolean,
    blackList: Boolean,
    tags: Array,
    edit: Boolean,
    maxlen: Number
  },
  methods: {
    applyTextEdit (operation) {
      this.editText = operation.api.origElements.innerHTML
      this.$emit('update', turndownService.turndown(this.editText))
    },
    buttonsToTags (buttons) {
      let tags = []
      for (let i = 0; i < buttons.length; i++) {
        switch (buttons[i]) {
          case 'italic':
            tags.push('i')
            break
          case 'bold':
            tags.push('b')
            tags.push('strong')
            break
          case 'underline':
            tags.push('u')
            break
          case 'strikethrough':
            tags.push('del')
            break
          case 'subscript':
            tags.push('sub')
            break
          case 'superscript':
            tags.push('sup')
            break
          case 'anchor':
            tags.push('a')
            break
          case 'image':
            tags.push('img')
            break
          case 'quote':
            tags.push('blockquote')
            break
          case 'orderedlist':
            tags.push('ol')
            tags.push('li')
            break
          case 'unorderedlist':
            tags.push('ul')
            tags.push('li')
            break
          default:
            tags.push(buttons[i])
        }
      }
      tags.push('p')
      tags.push('hr')
      return tags
    }
  },
  data () {
    return {
      editText: '',
      options: {
        toolbar: {
          buttons: [
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'italic',
            'bold',
            'underline',
            'strikethrough',
            'subscript',
            'superscript',
            'anchor',
            'image',
            'quote',
            'pre',
            'orderedlist',
            'unorderedlist',
            'indent',
            'outdent',
            'justifyLeft',
            'justifyCenter',
            'justifyRight',
            'justifyFull',
            'removeFormat'
          ]
        }
      }
    }
  },
  computed: {
    convertedAndSanitizedHtml () {
      let txt = this.text
      if (this.maxlen) {
        txt = this.text.substr(0, this.maxlen) + '&hellip;'
      }
      return sanitizeHtml(
        marked(txt, {
          sanitize: true
        }),
        {
          allowedTags: this.buttonsToTags(this.options.toolbar.buttons)
        }
      )
    }
  },
  mounted () {
    this.editor = new SimpleMDE({ element: this.$refs['editor_replace'], forceSync: true, promptURLs: true })
    this.editor.codemirror.on('change', () => {
      // console.log(this.editor.value())
      this.editText = this.editor.value()
      this.$emit('update', this.editText)
    })
  },
  watch: {
    edit (val) {
      if (val) {
        this.editor.value(val)
      }
    }
  }
}
</script>

<style lang="stylus">
  .editor-toolbar
    a
      display: inline-block
      padding: 5px
      cursor: pointer
</style>
