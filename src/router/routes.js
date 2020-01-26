
let routesExtension
try {
  routesExtension = require('../extensions/router/routes').default
} catch (e) {
  routesExtension = []
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/dacLayout.vue'),
    children: [
      { path: '', component: () => import('../extensions/pages/home') },
      {
        path: 'profile/:accountname',
        component: () => import('pages/profile')
      },
      {
        path: 'manage-candidateship',
        component: () => import('pages/manage-candidateship.vue')
      },
      {
        path: 'constitution',
        component: () => import('pages/constitution.vue')
      },
      { path: 'settings', component: () => import('pages/settings.vue') },
      { path: 'review-proposals', component: () => import('pages/review-proposals.vue') },
      { path: 'review-worker-proposals', component: () => import('pages/review-worker-proposals.vue') },
      { path: 'wps/:id', props: true, component: () => import('pages/worker-proposal.vue') },
      { path: 'referendums', component: () => import('pages/referendums') },
      {
        path: 'vote-custodians',
        component: () => import('pages/vote-custodians.vue')
      },
      {
        path: 'explore-dac',
        component: () => import('pages/explore-dac')
      }
    ]
  },

  {
    path: '/member',
    component: () => import('layouts/dacLayout.vue'),
    children: [
      { path: 'new-worker-proposal', component: () => import('pages/member/new-worker-proposal') },
      {
        path: 'my-worker-proposals',
        component: () => import('pages/member/my-worker-proposals')
      },
      { path: 'new-referendum', component: () => import('pages/member/new-referendum') }
    ]
  },

  {
    path: '/dac-activity',
    component: () => import('layouts/dacLayout.vue'),
    children: [
      { path: '', component: () => import('../extensions/pages/home') },
      {
        path: 'financials',
        component: () => import('pages/custodian/dac-financials')
      },
      {
        path: 'review-proposals',
        component: () => import('pages/review-proposals')
      },
      {
        path: 'review-worker-proposals',
        component: () => import('pages/review-worker-proposals')
      },
      {
        path: 'explore-dac',
        component: () => import('pages/explore-dac')
      }
    ]
  },

  {
    path: '/custodian',
    component: () => import('layouts/dacLayout.vue'),
    children: [
      {
        path: 'my-payments',
        component: () => import('pages/custodian/my-payments')/* ,
        beforeEnter: Guards.custodianCheck */
      },
      {
        path: 'dac-management',
        component: () => import('pages/custodian/dac-management'),
        children: [
          { path: '', redirect: 'financials' },
          {
            path: 'financials',
            component: () => import('pages/custodian/dac-financials')
          },
          {
            path: 'configuration',
            component: () => import('pages/custodian/contracts-config')
          },
          {
            path: 'constitution',
            component: () => import('pages/custodian/manage-constitution')
          },
          {
            path: 'advanced',
            component: () => import('pages/custodian/advanced')
          }
        ]
      }
      /* { path: '', component: () => import('../extensions/pages/home') },
      {
        path: 'review-msigs',
        component: () => import('pages/custodian/review-msigs')
      },, */
    ]
  }
]

routesExtension.forEach(re => {
  let existingPath = routes.find(r => r.path.trim() === re.path.trim())
  if (existingPath) {
    re.children.forEach(rep => {
      let i = existingPath.children.findIndex(
        ep => ep.path.trim() === rep.path.trim()
      )
      if (i === -1) {
        existingPath.children.push(rep)
      } else {
        existingPath.children[i] = rep
      }
    })
  } else {
    routes.push(re)
  }
})
console.log(routes)

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
