export const toolbar = [
  'headings',
  'bold',
  'italic',
  {
    name: 'quote',
    icon: `<svg t="1677846710477" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20756" width="250" height="250"><path d="M597.333333 725.333333h128l85.333334-170.666666V298.666667h-256v256h128M256 725.333333h128l85.333333-170.666666V298.666667H213.333333v256h128l-85.333333 170.666666z" fill="" p-id="20757"></path></svg>`
  },
  'link',

  'inline-code',
  'code',

  'list',
  'ordered-list',

  'strike',
  'check',

  'table',

  {
    name: 'align',
    icon: '<svg t="1677811472423" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20756" width="200" height="200"><path d="M128 128h768v85.333333H128V128m170.666667 170.666667h426.666666v85.333333H298.666667V298.666667m-170.666667 170.666666h768v85.333334H128v-85.333334m170.666667 170.666667h426.666666v85.333333H298.666667v-85.333333m-170.666667 170.666667h768v85.333333H128v-85.333333z" fill="" p-id="20757"></path></svg>',
    tip: '对齐方式',
    tipPosition: 'n',
    toolbar: [
      {
        name: 'align-left',
        icon: '<svg t="1677811482078" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20898" width="200" height="200"><path d="M128 128h768v85.333333H128V128m0 170.666667h512v85.333333H128V298.666667m0 170.666666h768v85.333334H128v-85.333334m0 170.666667h512v85.333333H128v-85.333333m0 170.666667h768v85.333333H128v-85.333333z" fill="" p-id="20899"></path></svg>',
        tip: '左对齐',
        tipPosition: 'n',
        prefix: '<div style="text-align: left;">',
        suffix: '</div>'
      },
      {
        name: 'align-center',
        icon: '<svg t="1677811472423" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="20756" width="200" height="200"><path d="M128 128h768v85.333333H128V128m170.666667 170.666667h426.666666v85.333333H298.666667V298.666667m-170.666667 170.666666h768v85.333334H128v-85.333334m170.666667 170.666667h426.666666v85.333333H298.666667v-85.333333m-170.666667 170.666667h768v85.333333H128v-85.333333z" fill="" p-id="20757"></path></svg>',
        tip: '居中对齐',
        tipPosition: 'n',
        prefix: '<div style="text-align: center;">',
        suffix: '</div>'
      },
      {
        name: 'align-right',
        icon: '<svg t="1677811512126" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="21040" width="200" height="200"><path d="M128 128h768v85.333333H128V128m256 170.666667h512v85.333333H384V298.666667m-256 170.666666h768v85.333334H128v-85.333334m256 170.666667h512v85.333333H384v-85.333333m-256 170.666667h768v85.333333H128v-85.333333z" fill="" p-id="21041"></path></svg>',
        tip: '右对齐',
        tipPosition: 'n',
        prefix: '<div style="text-align: right;">',
        suffix: '</div>'
      }
    ]
  },

  'content-theme',
  'code-theme',

  'edit-mode',
  'fullscreen',

  {
    name: 'more',
    tip: '更多',
    tipPosition: 'n',
    toolbar: ['both', 'export', 'outline', 'preview', import.meta.env.DEV ? 'devtools' : '']
  }
]
