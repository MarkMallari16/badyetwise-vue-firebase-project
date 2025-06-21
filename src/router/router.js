import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/pages/Home.vue';
import Login from '@/pages/Auth/Login.vue';
import Signup from '@/pages/Auth/Signup.vue';
import Guest from '@/pages/Guest.vue';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Transactions from '@/pages/Transactions.vue';
import Categories from '@/pages/Categories.vue';
import Budget from '@/pages/Budget.vue';
import Settings from '@/pages/Profile/Settings.vue';
import Support from '@/pages/Support.vue';
import Reports from '@/pages/Reports.vue';
const routes = [
    {
        path: '/',
        name: 'Guest',
        component: Guest
    },
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: {
            title: 'Home',
            requiresAuth: true,
            showSidebar: true
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signup',
        name: 'Signup',
        component: Signup
    },
    {
        path: '/transactions',
        name: 'Transactions',
        component: Transactions,
        meta: {
            title: 'Transactions',
            requiresAuth: true,
            showSidebar: true
        }
    },
   
    {
        path: '/categories/:tab',
        name: 'Categories',
        component: Categories,
        meta: {
            title: 'Categories',
            requiresAuth: true,
            showSidebar: true
        }
    },
    {
        path: '/settings',
        name: 'settings',
        component: Settings,
        meta: {
            title: 'Settings',
            requiresAuth: true,
            showSidebar: true
        }
    },
    {
        path: '/budget',
        name: 'budget',
        component: Budget,
        meta: {
            title: 'Budget',
            requiresAuth: true,
            showSidebar: true
        }
    },
    {
        path: '/support',
        name: 'Support',
        component: Support,
        meta: {
            title: 'Support',
            requiresAuth: true,
            showSidebar: true
        }
    }, {
        path: '/reports',
        name: 'Reports',
        component: Reports,
        meta: {
            title: 'Reports',
            requiresAuth: true,
            showSidebar: true
        }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0, left: 0 }
    }
})

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        )
    })
}

router.beforeEach(async (to, from, next) => {
    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (await getCurrentUser()) {
            next();
        } else {
            next("/");
        }
    } else {
        next()
    }
});

export default router;