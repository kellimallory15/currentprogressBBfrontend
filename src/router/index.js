import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/components/Home.vue'
import Auth from '@/components/Auth.vue'
import Register from '@/components/Register'
import ReaderList from '@/components/ReaderList'
import ReaderCreate from '@/components/ReaderCreate'
import BookList from '@/components/BookList'
import BookCreate from '@/components/BookCreate'
import AuthorCreate from '@/components/AuthorCreate'
import AuthorList from '@/components/AuthorList'

const routes = [
   {
     path: '/',
     name: 'Home',
     component: Home
  },
  {
    path: '/reader-list',
    name: 'ReaderList',
    component: ReaderList
  },
  {
    path: '/reader-list/:msg',
    name: 'ReaderUpdatedList',
    component: ReaderList
  },
  {
    path: '/reader-create',
    name: 'ReaderCreate',
    component: ReaderCreate
  },
  {
    path: '/reader-create/:pk',
    name: 'ReaderUpdate',
    component: ReaderCreate
  },
  {
    path: '/book-list',
    name: 'BookList',
    component: BookList
  },
  {
    path: '/book-list/:msg',
    name: 'BookUpdateList',
    component: BookList
  },
  {
    path: '/book-create',
    name: 'BookCreate',
    component: BookCreate,
    meta: { requiresSuperuser: true } 
  },
  {
    path: '/book-create/:pk',
    name: 'BookUpdate',
    component: BookCreate,
    meta: { requiresSuperuser: true }
  },
  {
    path: '/author-list',
    name: 'AuthorList',
    component: AuthorList
  },
  {
    path: '/author-list/:msg',
    name: 'AuthorUpdateList',
    component: AuthorList
  },
  {
    path: '/author-create',
    name: 'AuthorCreate',
    component: AuthorCreate,
    meta: { requiresSuperuser: true } 
  },
  {
    path: '/author-create/:pk',
    name: 'AuthorUpdate',
    component: AuthorCreate,
    meta: { requiresSuperuser: true } 
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth
  },
  {
    path:'/register',
    name: 'Register',
    component: Register
  } 
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresSuperuser = to.matched.some(record => record.meta.requiresSuperuser);
  const isSuperuser = localStorage.getItem('is_superuser') === 'true';

  if (requiresSuperuser && !isSuperuser) {
    next({ name: 'Home' }); 
  } else {
    next(); 
  }
});

export default router;
