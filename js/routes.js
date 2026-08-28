import List from './pages/List.js';
import Leaderboard from './pages/Leaderboard.js';
import Roulette from './pages/Roulette.js';
import Packs from './pages/ListPacks.js';
import RecordSubmission from './pages/RecordSubmission.js';

export default [
    { path: '/', component: List },
    { path: '/leaderboard', component: Leaderboard },
    { path: '/roulette', component: Roulette },
	{ path: '/packs', component: Packs },
	{ path: '/submissions', component: RecordSubmission },
];
