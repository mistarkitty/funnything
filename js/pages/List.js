import { store } from "../main.js";
import { embed, getThumbnailImage, getYoutubeIdFromUrl, getLevelThumbnail } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList, fetchPacks } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";

const roleIconMap = {
    owner: "crown",
    admin: "user-gear",
    helper: "user-shield",
    dev: "code",
    trial: "user-lock",
};

export default {
    components: { Spinner, LevelAuthors },
    template: `
	<!-- :style="level?.name ? { background: 'var(--color-background-list)' } : {}" -->
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list">
            <div class="list-container">
				<div style="display: grid;">
					<input v-model="searchQuery" placeholder="Input text to Filter! here..." class="btn" type="text" id="filterForLevelName"/>
				</div>
                <table class="list" v-if="list && list.length">
                    <tr v-for="(item, i) in filteredListDisplay" :key="item.originalIndex">
                        <template v-if="engineAsked == null">
                            <td class="rank">
                                <p v-if="item.originalIndex + 1 <= 150" class="type-label-lg">#{{ item.originalIndex + 1 }}</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                <button id="levelThumbnailReal" @click="selected = item.originalIndex" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em;" :style="getLevelThumbnail(item.originalIndex, list)" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }" class=" btnlvl">
                                    <span class="type-label-lg">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                                    <span class="type-label-sm">Verified by {{ item.level.verifier }}</span>
                                </button>
                            </td>
                         </template>
                        <template v-else-if="engineAsked == item.level.engine">
                            <td class="rank">
                                <p v-if="item.originalIndex + 1 <= 150" class="type-label-lg">#{{ item.originalIndex + 1 }}</p>
                                <p v-else class="type-label-lg">Legacy</p>
                            </td>
                            <td class="level" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }">
                                <button id="levelThumbnailReal" @click="selected = item.originalIndex" style="background-color: rgb(255 0 0 / 0); width: 90%; margin: 0.5em;" :style="getLevelThumbnail(item.originalIndex, list)" :class="{ 'active': selected === item.originalIndex, 'error': !item.level }" class=" btnlvl">
                                    <span class="type-label-lg">{{ item.level?.name || \`Error (\${item.err}.json)\` }}</span>
                                    <span class="type-label-sm">Verified by {{ item.level.verifier }}</span>
                                    <!-- oh okay -->
                                </button>
                            </td>
                        </template>
                    </tr>
                </table>
                
                <p v-if="list && list.length > 0 && filteredListDisplay && filteredListDisplay.length === 0" class="type-body-lg">
					<br>
                    No levels found matching your search.
                </p>
            </div>
            <div class="level-container">
			<a v-if="level" @click="selected = null">
            	<img src="../assets/back.svg" style="filter: var(--the-button-on-top); width: 12px">
            </a>
                <div class="level" v-if="level">
					<div style="display: flex; flex-direction: column; gap: 8px; width: 100%; justify-self: center;">
                    <div class="button-holder">
                        <h1>{{ level.name }}</h1>
						<img :src="getDemonDifficulty" height="32" style="margin-left: auto;">
                    </div>
                    <h1 style="border-bottom: 1px solid #808080;"></h1>
					<p class="desc" v-if="level.description" v-html="level.description" style="padding-top: 8px;"></p>
					</div>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier" :engine="level.engine"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen scrolling="no" allow="encrypted-media *; fullscreen *;" style="border-radius: 1rem;"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div v-else class="type-title-sm">ID</div>
                            <p>{{ level.id }}</p>
                        </li>
                        <li>
                            <div class="type-title-sm">Main GD difficulty</div>
                            <p>{{ level.demonDifficulty }}</p>
                        </li>
                        <li v-if="engiCalc">
                            <div class="type-title-sm">Enjoyment rating</div>
							<p v-if="level.name == 'BonesJones Challenge'">fuck no</p>
                            <p v-else>{{ engiCalc }}</p>
                        </li>
                    </ul>
                    <h2>Records ({{ level.records.length }})</h2>
                    <p v-if="selected + 1 <= 75"><strong>{{ level.percentToQualify }}%</strong> or better to qualify</p>
                    <p v-else-if="selected + 1 <= 150"><strong>100%</strong> or better to qualify</p>
                    <p v-else>This level does not accept new records.</p>
                    <p v-if="level.legacy">This level should be beaten with legacy hitboxes</p>
                    <p v-else-if="level.legacy == false">This level must be beaten using the new hitboxes</p>
                    <p v-if="level.twoplayer">This level must be beaten solo to qualify</p>
                    <table class="records">
                        <tr v-for="record in level.records" class="record">
                            <td class="percent">
                                <p>{{ record.percent }}%</p>
                            </td>
                            <td class="user">
                                <a :href="record.link" target="_blank" class="type-label-lg">{{ record.user }}</a>
                            </td>
							<td class="hz">
                                <p v-if="record.enj">{{ record.enj }}/100</p>
                            </td>
                            <td class="mobile">
                                <img v-if="record.mobile" :src="\`/assets/phone-landscape\${store.dark ? '-dark' : ''}.svg\`" alt="Mobile">
                            </td>
                            <td class="controller">
                                <img v-if="record.controller" src="/assets/controller.svg" width="24" alt="Controller">
                            </td>
                            <td class="hz">
                                <p>{{ record.hz }}Hz</p>
                            </td>
                        </tr>
                    </table>
                </div>
                    <div v-else-if="selected == null" class="level" style="height: 100%; display: flex; justify-content: center; align-items: center; text-align: center;">
                    <h2>Welcome to the ShadowGDPS Demonlist!</h2>
                    <p>Click the levels on the left side to see information about them!</p>
                    <p>For more information about the submission rules check the right side!</p>
                    <button class="btn" @click="selected = Math.ceil(Math.random() * list.length)">
                    	<span class="type-label-lg">I'm feeling lucky</span>
					</button>
                </div>
            </div>
            <div class="meta-container">
                <div class="meta">
                    <div class="errors" v-show="errors.length > 0">
                        <p class="error" v-for="error of errors">{{ error }}</p>
                    </div>
                    <div class="og">
                        <p class="type-label-md">Website layout made by <a href="https://tsl.pages.dev" style="text-decoration: underline;" target="_blank">TheShittyList</a> with certain features by <a href="https://sgdlist.pages.dev" style="text-decoration: underline;" target="_blank">The SGD List</a>. <br> UI inspired by <a href="https://aredl.net" style="text-decoration: underline;" target="_blank">The All Rated Extreme Demons List</a>. <br> Points equation stolen from <a href="https://list-calc.finite-weeb.xyz" style="text-decoration: underline;" target="_blank">this peak website</a> and <a href="https://www.pointercrate.com" style="text-decoration: underline;" target="_blank">Pointercrate</a>.</p>
                    </div>
                    <template v-if="editors">
                        <h2>List Moderators</h2>
                        <ol class="editors">
                            <li v-for="editor in editors" style="height: 20px;">
                                <img :src="\`/assets/\${roleIconMap[editor.role]}\${store.dark ? '-dark' : ''}.svg\`" :alt="editor.role">
                                <a v-if="editor.name" class="type-label-lg link" target="_blank">{{ editor.name }}</a>
								<br>
                                <div class="button-holder">
                                    <!-- money folder -->
                                    <a v-if="editor.ytHandle != null" :href="\`https://www.youtube.com/@\${editor.ytHandle}\`" target="_blank">
										<img src="../assets/youtube.svg" height="40" class="button-center" style="filter: var(--the-button-on-top); height: 30px;">
                                    </a>
                                    <a v-if="editor.discordId != null" :href="\`https://discord.com/users/\${editor.discordId}\`" target="_blank">
										<img src="../assets/discord.svg" height="40" class="button-center" style="filter: var(--the-button-on-top); height: 30px;">
                                    </a>                         
                                </div>
                            </li>
                        </ol>
                    </template>
                    <h2>Submission Requirements</h2>
                    <h3 style="font-weight: 550;">
                        Record submission:
                    </h3>
                    <p>
                        - You must be on the newest version of the game to submit a record.
                    </p>
                    <p>
                        - The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt.
                    </p>
                    <p>
						- For Bass Boosted and harder, you must show clicks/taps.
                    </p>
					<p>
						- The recording must show the FPS used, or give moderator raw footage of the completion.
					</p>
                    <p>
                        - Do not use secret routes or bug routes.
                    </p>
                    <p>
                        - Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level.
                    </p>
                    <h3 style="font-weight: 550;">
                        Level requirement:
                    </h3>
                    <p>
                        - A level must be rated on ShadowGDPS.
                    </p>
                    <p>
                        - thats it :p
                    </p>
                </div>
            </div>
            <!-- <img v-if="level.name" :src="getThumbnailImage(level.name)" style="position: absolute; left: 0px; top: 0px; z-index: -1; object-fit: cover; width: 100%; height: 100%; filter: brightness(50%);">
            <img v-else src="../assets/white.webp" style="position: absolute; left: 0px; top: 0px; z-index: -1; object-fit: cover; width: 100%; height: 100%; filter: brightness(10%);"> -->
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: null,
        levelSearch: null,
        searchQuery: '',
        ii: 0,
        blt: 0,
        errors: [],
        roleIconMap,
        store,
    }),
    computed: {
        getDemonDifficulty() {
            if (this.selected == null) {
            	return 0;
            } else {
                if (this.list[this.selected][0].demonDifficulty == "Iraq Demon") {
                    this.fileFormat = '.svg';
                } else {
                    this.fileFormat = '.png';
                }
                if (this.list[this.selected][0].demonDifficulty == "PETA Demon") {
                    return "https://www.peta.org/wp-content/themes/peta/src/assets/images/svgs/peta-logo.svg";
                } else if (this.list[this.selected][0].demonDifficulty == "Poopy Demon") {
                    return "https://raw.githubusercontent.com/twitter/twemoji/a6f943b958d94b2b82f886aa540b915d9a694a75/assets/svg/1f4a9.svg";
                } else if (this.list[this.selected][0].demonDifficulty == "love Demon") {
                    return "https://upload.wikimedia.org/wikipedia/commons/c/c8/Twemoji15.0.2_1fa77.svg";
                } else if (this.list[this.selected][0].demonDifficulty == "Top 14 Very Hard Timing Map Very Demon") {
                    return "https://media.tenor.com/ejuK2N9toPMAAAAe/gd-geometry-dash.png";
                } else if (this.list[this.selected][0].name == "Lucid Dreaming") {
                    return "https://upload.wikimedia.org/wikipedia/commons/7/72/Twemoji_1f634.svg";
                }
                // Playstation Vita credit: https://image.ceneostatic.pl/data/products/13107195/i-sony-playstation-vita-wifi.jpg can we even use this legally idk don't sue
                return encodeURI(`assets/difficulties/${this.list[this.selected][0].demonDifficulty}${this.fileFormat}`);
            }
        },
        level() {
            if (this.selected == null) {
            	return 0;
            } else {
                return this.list[this.selected][0];
            }
        },
        originalListWithIndex() {
            return (this.list || []).map(([level, err], index) => ({
                level,
                err,
                originalIndex: index,
            }));
        },
        filteredListDisplay() {
            if (!this.searchQuery.trim()) {
                return this.originalListWithIndex;
            }
            const searchTerm = this.searchQuery.toLowerCase();
            console.warn((this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm.toLowerCase())));
            return (this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm.toLowerCase()));
		},
		originalPacksWithIndex() {
            console.error(this.packs);
            return this.packs;
        },
        engiCalc() {
            let enjoyments = [];
            let enjoymentAverage = this.level.enj;
            for (let index = 0; index < this.level.records.length; index++) {
                enjoyments.push(this.level.records[index].enj)
            }
            for (let index = 0; index < enjoyments.length; index++) {
				if (enjoyments[index]) {
                	enjoymentAverage = (enjoymentAverage + enjoyments[index]) / 2;
				}
            }
            return enjoymentAverage;
        },
        video() {
            if (!this.level.showcase) {
                return embed(this.level.verification);
            }
            return embed(this.level.showcase);
        },
    },
    watch: {
        filteredListDisplay: {
            handler(newList) {
                if (newList.length > 0) {
                    const currentSelectionInNewList = newList.find(item => item.originalIndex === this.selected);
                    if (!currentSelectionInNewList) {
                        this.selected = newList[0].originalIndex;
                    }
                } else {
                    this.selected = null;
                }
            },
        },
    },
    async mounted() {
        // Hide loading spinner
        this.list = await fetchList();
        this.editors = await fetchEditors();
		this.packs = await fetchPacks();

        // Error handling
        if (!this.list) {
            this.errors = [
                "Failed to load list. Retry in a few minutes or notify list staff.",
            ];
        } else {
            this.errors.push(
                ...this.list
                    .filter(([_, err]) => err)
                    .map(([_, err]) => {
                        return `Failed to load level. (${err}.json)`;
                    })
            );
            if (!this.editors) {
                this.errors.push("Failed to load list editors.");
            }
        }

        this.loading = false;
    },
    methods: {
        embed,
        score,
        getLevelThumbnail,
        getThumbnailImage
    },
};
