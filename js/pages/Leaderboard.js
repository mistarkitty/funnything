import { fetchWhichLeaderboard, fetchList } from '../content.js';
import { localize, getLevelThumbnail } from '../util.js';

import Spinner from '../components/Spinner.js';

export default {
    components: {
        Spinner,
    },
    data: () => ({
        leaderboard: [],
        loading: true,
        selected: 0,
        err: [],
    }),
    template: `
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-leaderboard-container">
            <div class="page-leaderboard">
                <div class="error-container">
                    <p class="error" v-if="err.length > 0">
                        Leaderboard may be incorrect, as the following levels could not be loaded: {{ err.join(', ') }}
                    </p>
                </div>
                <div class="board-container">
                <p>Which leaderboard would you like to see?</p>
                <br>
                	<form action="#" class="type-label-lg">
						<div style="display: flex; align-items: center; gap: 10px;">
                    		<select class="btn" v-model="type" id="type" name="type">
								<option value="type of leaderboard..." disabled selected>type of leaderboard...</option>
                        		<option class="type-label-lg" value="Player" selected>Player</option>
                                <option class="type-label-lg" value="Creator">Creator</option>
                        	</select>
					    	<button class="btn" type="submit">Go!</button>
						</div>
					</form>
                    <br>
                    <table class="board">
                        <tr v-for="(ientry, i) in leaderboard">
                            <td class="rank">
                                <p class="type-label-lg">#{{ i + 1 }}</p>
                            </td> 
                            <td class="total" style="display: inline-flex; align-items: center; padding: 1.5em;">
                                <p v-if="whichLeaderboard == 'creator'" class="type-label-lg">{{ ientry.total }}</p> 
                                <p v-else class="type-label-lg">{{ localize(ientry.total) }}</p> 
                                <img v-if="whichLeaderboard == 'creator'" src="../assets/hammer.png" height="24">
                            </td>
                            <td class="user" :class="{ 'active': selected == i }">
                                <button @click="selected = i">  
                                    <div style="align-items: center; gap: 20px;">
                                        <span style="display: inline-block;" class="type-label-lg">{{ ientry.user }}</span>
                                    </div>
                                </button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="player-container" style="border-collapse: separate;">
                    <div class="player" style="border-collapse: separate;">
                        <h1 style="display: inline-flex; align-items: center;">#{{ selected + 1 }} - {{ entry.user }}
                        	<div style="display: inline-flex; align-items: center; gap: 20px;">
                            	<p></p>
                                <img v-if="['unruffled', 'ryannmay', 'ballgoballing', 'awu3248', 'GrasHopperrSGD', 'cross1508'].includes(entry.user)" src="../assets/pig.svg" height="32"/>
                                <img v-if="['compsognathus3', 'Wallyboom2010', 'thomaslyu', 'cross1508', 'antawng2', 'Captinfireball', 'Kevmaster04', 'DerpIsOk', 'Acc0unt_GD', 'PlayerEpic86', 'RubenChuGD', 'zes2384', 'TempestWinds', 'geometrydash-creator', 'GD_Noob', 'KING_MAST3R2O1O', 'OchiAoyos', 'ballgoballing', 'sh3lt0n'].includes(entry.user)" src="../assets/gdr.svg" height="32"/>
                                <img v-if="['Squeeg', 'BLJ_BrokenGD', 'realtoreeeeee', 'LegoScratchTanksuber', 'Captinfireball'].includes(entry.user)" src="../assets/iphone.svg" height="32"/>
                                <img v-if="['oopsied', 'Peneren', 'Andrey7331', 'CreativeStegosaur'].includes(entry.user)" src="../assets/spooky.svg" height="32"/>
                                <img v-if="['Squeeg'].includes(entry.user)" src="../assets/cfb.svg" height="32"/>
                                <img v-if="['meow_wet', 'ballgoballing', 'antawng2'].includes(entry.user)" src="../assets/tsprint.svg" height="32"/>
                                <img v-if="['meow_wet'].includes(entry.user)" src="../assets/gdi.svg" height="32"/>
                            </div>
						</h1> 
                        <template v-if="entry.verified.length > 0 || entry.completed.length > 0">
                        <h3>{{ entry.total }} - Hardest: {{ [...entry.verified, ...entry.completed].reduce((min, current) =>current.rank < min.rank ? current : min).level }}</h3>
                        </template>
                        <template v-if="entry.created.length > 0">
                        <h2>Created ({{ entry.created.length}})</h2>
                        <table class="table" style="display: grid; gap: 6px;">
                            <tr v-for="score in entry.created">
                                <td class="rank" style="text-align: end;">
                                    <p>#{{ score.rank }}</p>
                                </td>
                                <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                    <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link">{{ score.level }}</a>
                                </td>
                            </tr>
                        </table>
                        </template>
                        <template v-if="entry.verified.length > 0">
                            <h2>Verified ({{ entry.verified.length}})</h2>
                            <table class="table" style="display: grid; gap: 6px;">
                                <tr v-for="score in entry.verified">
                                    <td class="rank" style="text-align: end;">
                                        <p>#{{ score.rank }}</p>
                                    </td>
                                    <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem;" target="_blank" :href="score.link">{{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-if="entry.completed.length > 0">
                            <h2 v-if="entry.completed.length > 0">Completed ({{ entry.completed.length }})</h2>
                            <table class="table" style="display: grid; gap: 6px;">
                                <tr v-for="score in entry.completed">
                                    <td class="rank">
                                        <p>#{{ score.rank }}</p>
                                    </td>
                                    <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" style="border-collapse: collapse; border-spacing: 0rem" target="_blank" :href="score.link">{{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                        <template v-if="entry.progressed.length > 0">
                        <h2>Progressed ({{entry.progressed.length}})</h2>
                            <table class="table" style="display: grid; gap: 6px;">
                                <tr v-for="score in entry.progressed">
                                    <td class="rank">
                                        <p>#{{ score.rank }}</p>
                                    </td>
                                    <td class="level" style="border-radius: 10px; margin: 1px; padding-left: 18px; height: 48px;" :style="getLevelThumbnail(score.rank - 1, list)">
                                        <a class="type-label-lg" target="_blank" style="border-collapse: collapse; border-spacing: 0rem;" :href="score.link">{{ score.percent }}% - {{ score.level }}</a>
                                        <span class="type-label-sm">+{{ localize(score.score) }}</span>
                                    </td>
                                </tr>
                            </table>
                        </template>
                    </div>
                </div>
            </div>
        </main>
    `,
    computed: {
        entry() {
			console.error(this.leaderboard);
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        let params = new URLSearchParams(document.location.search); 
        if (!params.get("type")) {
            this.whichLeaderboard = "Player";
        } else {
            this.whichLeaderboard = params.get("type").toLowerCase();
        }
        const [leaderboard, err] = await fetchWhichLeaderboard();
        this.list = await fetchList();
        this.leaderboard = leaderboard;
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
        getLevelThumbnail,
    },
};
