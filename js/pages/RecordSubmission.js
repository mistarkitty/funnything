import { fetchLeaderboard } from '../content.js';
import { localize } from '../util.js';

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
        <main v-else class="page-list" style="background-color: var(--color-background); color: var(--color-on-background); display: grid; grid-template-columns: 1fr minmax(16em, 0.6fr); column-gap: 2rem;">
		<div class="list-container">
		<!-- https://stackoverflow.com/questions/21102684/google-forms-send-data-to-spreadsheet#:~:text=6%20Answers&text=Here's%20what%20worked%20for%20me,making%20an%20ajax%20form%20submit -->
		<form action="https://docs.google.com/forms/d/e/1FAIpQLSeUetWHI4ZBuSRvYiya8fh0VDFRsSIQwugJaPdhSw8slEiMbg/formResponse" style="display: flex; flex-direction: column; gap: 20px; align-item: center; margin-left: 16px;" target="hidden_iframe" onsubmit="alert('Record submitted!');" method="post">
			<h1>Submitting Record</h1>
				<h2 for="entry.948336362">Type of record:</h2>
					<select style="margin-left: 16px;" id="type" name="entry.948336362" class="btn" required>
    					<option value="" disabled selected>type of record</option>
    					<option value="Completion">Completion</option>
    					<option value="Verification">Verification</option>
    					<option value="Progress">Progress</option>
  					</select>
				<h2 for="entry.1246419515">What is the level called?</h2>
					<input type="text" id="name" name="entry.1246419515" class="btn" placeholder="name of level..." autocomplete="off" style="margin-left: 16px;" required>
				<h2 for="entry.515990969">Link of completion/verification (YouTube link is recommended!):</h2>
					<input type="text" id="link" name="entry.515990969" class="btn" placeholder="completion/verification link..." autocomplete="off" style="margin-left: 16px;" required>
				<h2 for="entry.1322327482">Link to the level (if it's a verification):</h2>
					<input type="text" id="levellink" name="entry.1322327482" class="btn" placeholder="level link..." autocomplete="off" style="margin-left: 16px;">
				<h2 for="entry.421975169">What's the %? (if it's a progress)</h2>
					<input type="text" id="progressperc" name="entry.421975169" class="btn" placeholder="percentage..." autocomplete="off" style="margin-left: 16px;">
				<h2 for="entry.2014011982">Opinion on level? (enjoyment rating and placement)</h2>
					<input type="text" id="opinion" name="entry.2014011982" class="btn" placeholder="opinion..." autocomplete="off" style="margin-left: 16px;">
				<h2 for="entry.400387763">Additional notes:</h2>
					<input type="text" id="note" name="entry.400387763" class="btn" placeholder="note..." autocomplete="off" style="margin-left: 16px;">
				<h2 for="entry.824066392">Contact info (Your Scratch username and/or Discord username) (Very important, if not provided correctly record could be not added!)</h2>
					<input type="text" id="info" name="entry.824066392" class="btn" placeholder="info..." autocomplete="off" style="margin-left: 16px;">
				<h2 for="entry.2067279213">Is your completion/verification of said level completed <a target="_blank" style="text-decoration: underline;" href="https://dictionary.cambridge.org/dictionary/english/illegitimately">illegitimately</a>? (be honest) (read the thing carefully)</h2>
					<select style="margin-left: 16px;" id="type" name="entry.2067279213" class="btn" required>
    					<option value="" disabled selected>yes/no...</option>
    					<option value="Yes">Yes</option>
    					<option value="No">No</option>
  					</select>
				<button class="btn" type="submit" style="width: auto; align-self: center;">
					<span class="type-label-lg">Submit record!</span>
				</button>
			<iframe name="hidden_iframe" id="hidden_iframe" style="display: none;"></iframe>
		</form>
		</div>
		<div class="meta-container">
			<div class="meta">
					<h2>Submission Requirements</h2>
                    <h3 style="font-weight: 550;">
                        Record submission:
                    </h3>
                    <p>
                        - Achieved the record without using hacks (however, Turbowarp's FPS bypass is allowed, up to 250fps for levels that support delta time like Geometry Dash Revamped, Geometry Pig Dash,... and levels use Peneren's Spooky Dash Mods or Peneren's Pig Dash Mods can use hacks that don't affect the cheat indicator except speedhack).
                    </p>
                    <p>
                        - The recording must have a previous attempt and entire death animation shown before the completion, unless the completion is on the first attempt.
                    </p>
                    <p>
						- The recording must also show the player hit the endwall or reach the empty part at the end of the level, or the completion will be invalidated.
                    </p>
					<p>
						- Completion must use ~30 fps (you can use more than 30 fps for projects that have delta time built into them).
					</p>
					<p>
						- The recording must show the FPS used, or give moderator raw footage of the completion.
					</p>
                    <p>
                        - Do not use secret routes or bug routes.
                    </p>
                    <p>
                        - Do not use easy modes, only a record of the unmodified gameplay qualifies (depends on what level it is).
                    </p>
                    <p>
                    	- For harder levels, repeatably not having raw footage/clicks could impact your levels/records getting added.
If you accidentally show information in your completion you do not want shown, you can also show yourself getting far on the level with clicks/raw footage.
It is recommended to upload your raw footage as a file.
                    </p>
                    <p>
                        - Once a level falls onto the Legacy List, we accept records for it for 24 hours after it falls off, then afterwards we never accept records for said level.
                    </p>
                    <h3 style="font-weight: 550;">
                        Level requirement:
                    </h3>
                    <p>
                        - A level must be 20 seconds or longer and it must have decent quality of gameplay.
                    </p>
                    <p>
                        - A level must have some effort put into it.
                    </p>
                    <p>
                        - A level that has spam as main difficulty is not eligible to add.
                    </p>
                </div>
            </div>
			</main>
    `,
    computed: {
        entry() {
            return this.leaderboard[this.selected];
        },
    },
    async mounted() {
        const [leaderboard, err] = await fetchLeaderboard();
        this.leaderboard = leaderboard;
        this.err = err;
        // Hide loading spinner
        this.loading = false;
    },
    methods: {
        localize,
    },
};
