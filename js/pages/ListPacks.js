import { store } from "../main.js";
import { embed, getYoutubeIdFromUrl, getLevelThumbnail } from "../util.js";
import { score } from "../score.js";
import { fetchEditors, fetchList, fetchPacks } from "../content.js";

import Spinner from "../components/Spinner.js";
import LevelAuthors from "../components/List/LevelAuthors.js";
import levelThumbnail from "../components/List/LevelThumbnail.js";

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
        <main v-if="loading">
            <Spinner></Spinner>
        </main>
        <main v-else class="page-list" style="grid-template-columns: auto minmax(16rem, 0.4fr) 1fr;">
            <div class="list-container">
                <table class="list" v-if="packs && packs.length">
                    <tr v-for="([pack, err], i) in filteredPacksDisplay">
                            <td class="level" :class="{ 'active': packSelected === i }">
                                <button id="levelThumbnailReal" @click="packSelected = i, showPacks" style="background-color: rgb(255 0 0 / 0); width: 300px; margin: 0.5em;" :style="\`background-image: var(--level-button), url(\'../assets/levels/\${encodeURIComponent(packs[i][0].levels[0])}.png\'); background-size: cover; background-repeat: no-repeat; background-position: center;\`" :class="{ 'active': packSelected === i, 'error': !pack }" class=" btnlvl">
                                    <span class="type-label-lg">{{ pack.name || \`Error (\${err}.json)\` }}</span>
                                </button>
                            </td>
                    </tr>
                </table>
                
                <p v-if="list && list.length > 0 && filteredListDisplay && filteredListDisplay.length === 0" class="type-body-lg">
                    No levels found matching your search.
                </p>
            </div>
            <div class="list-container">
                <table class="list" v-if="list && list.length">
                    <tr v-for="(item, i) in filteredListPackDisplay" :key="item.originalIndex">
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
                </table>
                <p v-if="list && list.length > 0 && filteredListDisplay && filteredListDisplay.length === 0" class="type-body-lg">
                    No levels found matching your search.
                </p>
            </div>
			<div class="level-container">
			<a v-if="level" @click="selected = null">
            	<img src="../assets/back.svg" style="filter: var(--the-button-on-top); width: 12px">
            </a>
                <div class="level" v-if="level">
					<div style="display: flex; flex-direction: column; gap: 1rem; width: 100%; justify-self: center;">
					<h1 style="border-bottom: 1px solid #808080;padding-bottom: 8px;">{{ level.name }}</h1>
					<p class="desc" v-if="level.description" v-html="level.description"></p>
					</div>
                    <LevelAuthors :author="level.author" :creators="level.creators" :verifier="level.verifier" :engine="level.engine"></LevelAuthors>
                    <iframe class="video" id="videoframe" :src="video" frameborder="0" allowfullscreen scrolling="no" allow="encrypted-media *; fullscreen *;" style="border-radius: 1rem;"></iframe>
                    <ul class="stats">
                        <li>
                            <div class="type-title-sm">Points when completed</div>
                            <p>{{ score(selected + 1, 100, level.percentToQualify) }}</p>
                        </li>
                        <li>
                            <div v-if="level.scratchLink != null" class="type-title-sm">Links</div>
                            <div v-else-if="level.itchLink2 != null" class="type-title-sm">Links</div>
                            <div v-else class="type-title-sm">Link</div>
                            <div class="button-holder">
                            <!-- money folder -->
								<a v-if="level.scratchLink != null" :href="level.scratchLink" target="_blank">
                                	<button class="link-button" style="background-color: #f7a935; border-color: #f7a935;">
										<img src="../assets/scratchS.svg" class="button-center" style="width:70%;">
									</button>
                                </a>
                                <a v-if="level.turbowarpLink != null" :href="level.turbowarpLink" target="_blank">
                                	<button class="link-button" style="background-color: #ff4c4c; border-color: #ff4c4c;">
										<img src="../assets/turbowarpT.svg" class="button-center" style="width:110%;">
									</button>
                                </a>
                                <a v-if="level.itchLink != null" :href="level.itchLink" target="_blank">
                                	<button class="link-button" style="background-color: #fa5c5c; border-color: #fa5c5c;">
										<img src="../assets/itchioShop.svg" class="button-center" style="width:100%;"></button>
                                </a>
                                <a v-if="level.itchLink2 != null" :href="level.itchLink2" target="_blank">
                                	<button class="link-button" style="background-color: #7d2e2e; border-color: #7d2e2e;">
                                    	<p class="button-center" style="width: 100%; color: #fff;">LDM</p>
									</button>
                                </a>                                
                            </div>
                        </li>
                        <li>
                            <div class="type-title-sm">Main GD difficulty</div>
                            <p>{{ level.demonDifficulty }}</p>
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
                    <h2>Packs</h2>
					<p>yea</p>
					<h2>Packs changelog</h2>

				<!-- guide bc i suck at css -->
                <!-- you know that you can put multiple lines in this comment,
                right? -->
				<!-- why not 4 different


                                        lines!
 -->
			<!-- add level: <p class="cl">- Added <clw>name</clw> at <clw>#</clw></p> -->
			<!--  <br>- Added <clw>name</clw> at <clw>#</clw> -->
			<!-- move level: <p class="cl">- Moved <clw>name</clw> from <clw>#</clw> to <clw>#</clw></p> -->
			<!--  <br>- Moved <clw>name</clw> from <clw>#</clw> to <clw>#</clw> -->

                    <main style="display: flex; flex-direction: column; align-items: left; gap: 24px; text-align: left; overflow: hidden; overflow-y: auto; max-height: 300px; width: 700px; border: 3px solid var(--color-primary); border-radius: 5px;">
            			<div style="display: flex; flex-direction: column; align-items: left; gap: 24px; overflow: visible; margin-left: 10px; margin-top: 12px">
                			<p>nothing here yet...</p>
						</div>
        			</main>
                </div>
            </div>
        </main>
    `,
    data: () => ({
        list: [],
        editors: [],
        loading: true,
        selected: null,
        packSelected: null,
        levelSearch: null,
        searchQuery: '',
        ii: 0,
        blt: 0,
        errors: [],
        roleIconMap,
        store,
    }),
    computed: {
        level() {
            if (this.selected == null) {
            	return 0;
            } else {
                return this.list[this.selected][0];
            }
        },
        showPacks() {
            if (this.packSelected) {
            console.error(this.packs[this.packSelected][0].levels);
            return this.packs[this.packSelected][0].levels;
            }
            console.error(this.packs[0][0].levels);
            return this.packs[0][0].levels;
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
            console.error((this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm) && item.level?.engine?.includes(this.engineAsked)));
            return (this.originalListWithIndex || []).filter(item => item.level?.name?.toLowerCase().includes(searchTerm) && item.level?.engine?.includes(this.engineAsked));
		},
        filteredListPackDisplay() {
            if (this.packSelected || this.packSelected == 0) {
                return (this.originalListWithIndex || []).filter(item => this.packs[this.packSelected][0].levels.includes(item.level?.name));
            }
            return 0;
		},
        originalPacksWithIndex() {
            console.error(this.packs);
            return this.packs;
        },
        filteredPacksDisplay() {
            return this.originalPacksWithIndex;
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
        this.packs = await fetchPacks();
        this.editors = await fetchEditors();

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
    },
};
