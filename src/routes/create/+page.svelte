<script lang="ts">
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores';
	import { questionSuggestions, noOptionsLibrary } from '$lib/utils';
	import { Heart, ArrowLeft, ArrowRight, Sparkles, Image, MessageCircle, Palette, Check } from 'lucide-svelte';

	let { form } = $props();

	// Wizard state
	let step = $state(1);
	const totalSteps = 6;

	// Form data
	let questionText = $state('');
	let crushName = $state('');
	let title = $state('');
	let selectedNoOptions = $state<string[]>([]);
	let customNoText = $state('');
	let photoFile = $state<File | null>(null);
	let photoPreview = $state('');
	let extraMessage = $state('');
	let themeColor = $state('#fce4ec');
	let loading = $state(false);

	// Step heart emojis
	const stepEmojis = ['❤️', '💖', '📝', '😢', '📸', '✨'];

	function nextStep() {
		if (step < totalSteps) step++;
	}

	function prevStep() {
		if (step > 1) step--;
	}

	function selectSuggestion(suggestion: string) {
		questionText = suggestion;
	}

	function toggleNoOption(option: string) {
		if (selectedNoOptions.includes(option)) {
			selectedNoOptions = selectedNoOptions.filter((o) => o !== option);
		} else {
			selectedNoOptions = [...selectedNoOptions, option];
		}
	}

	function addCustomNo() {
		if (customNoText.trim() && !selectedNoOptions.includes(customNoText.trim())) {
			selectedNoOptions = [...selectedNoOptions, customNoText.trim()];
			customNoText = '';
		}
	}

	function onPhotoSelect(e: Event) {
		const input = e.target as HTMLInputElement;
		if (input.files && input.files[0]) {
			photoFile = input.files[0];
			const reader = new FileReader();
			reader.onload = (ev) => {
				photoPreview = ev.target?.result as string;
			};
			reader.readAsDataURL(input.files[0]);
		}
	}

	$effect(() => {
		if (form?.error) {
			toasts.error(form.error);
		}
	});

	// Validation helpers
	let canProceed = $derived.by(() => {
		switch (step) {
			case 1: return questionText.trim().length > 0;
			case 2: return crushName.trim().length > 0;
			case 3: return title.trim().length > 0;
			case 4: return selectedNoOptions.length >= 3;
			case 5: return true; // Photo is optional
			case 6: return true; // Extra message is optional
			default: return false;
		}
	});
</script>

<svelte:head>
	<title>Create Confession ✨ — Love Sent</title>
	<meta name="description" content="Create your personalized love confession with cute animations and playful interactions!" />
</svelte:head>

<div class="min-h-[80vh] px-4 py-8 bg-love-gradient">
	<div class="max-w-2xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-8">
			<h1 class="text-5xl font-dancing text-pink-600 mb-2">Create Your Confession 💌</h1>
			<p class="text-gray-500">Fill each step with love — your crush will adore it!</p>
		</div>

		<!-- Progress Steps -->
		<div class="flex justify-center mb-8" role="progressbar" aria-valuemin={1} aria-valuemax={totalSteps} aria-valuenow={step}>
			<ul class="steps steps-horizontal">
				{#each Array(totalSteps) as _, i}
					<li class="step {i + 1 <= step ? 'step-primary' : ''}" data-content={stepEmojis[i]} aria-label="Step {i+1} of {totalSteps}">
						<span class="text-xs hidden sm:inline">
							{['Question', 'Crush', 'Title', 'No Texts', 'Photo', 'Final'][i]}
						</span>
					</li>
				{/each}
			</ul>
		</div>

		<!-- Wizard Card -->
		<div class="card bg-white/95 backdrop-blur shadow-xl rounded-3xl border border-pink-100 card-cute">
			<div class="card-body p-8">
				<!-- Step 1: Question -->
				{#if step === 1}
					<div class="wizard-step" class:active={step === 1}>
						<div class="text-center mb-6">
							<span class="text-5xl mb-3 inline-block animate-bounce-cute" aria-hidden="true">😍</span>
							<h2 class="text-3xl font-dancing text-pink-600">What's Your Big Question?</h2>
							<p class="text-gray-500 mt-1">Pick a suggestion or write your own!</p>
						</div>

						<textarea
							bind:value={questionText}
							placeholder="Will You Be My Valentine? 💖"
							class="textarea textarea-bordered w-full rounded-2xl h-24 text-lg focus:border-pink-400 mb-4"
							aria-label="Enter your confession question"
						></textarea>

						<div class="mb-4">
							<p class="text-sm text-gray-500 mb-2 font-medium">💡 Suggestions:</p>
							<div class="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
								{#each questionSuggestions as suggestion}
									<button
										class="btn btn-sm rounded-full {questionText === suggestion ? 'btn-primary' : 'btn-outline border-pink-200 text-pink-500 hover:bg-pink-50'}"
										onclick={() => selectSuggestion(suggestion)}
										aria-label="Select question: {suggestion}"
									>
										{suggestion}
									</button>
								{/each}
							</div>
						</div>
					</div>
				{/if}

				<!-- Step 2: Crush Name -->
				{#if step === 2}
					<div class="wizard-step" class:active={step === 2}>
						<div class="text-center mb-6">
							<span class="text-5xl mb-3 inline-block animate-pulse-heart" aria-hidden="true">💖</span>
							<h2 class="text-3xl font-dancing text-pink-600">Who's the Lucky Crush?</h2>
							<p class="text-gray-500 mt-1">Enter their name — we'll make it special!</p>
						</div>

						<input
							type="text"
							bind:value={crushName}
							placeholder="Their name (e.g., Alex) 😊"
							class="input input-bordered w-full rounded-2xl text-lg focus:border-pink-400"
							aria-label="Enter your crush's name"
						/>

						{#if crushName}
							<div class="mt-4 p-4 bg-pink-50 rounded-2xl text-center">
								<p class="text-pink-600 font-medium">
									Preview: <span class="font-dancing text-2xl">{crushName}</span>, {questionText || 'Will You Be My Valentine?'} 💕
								</p>
							</div>
						{/if}
					</div>
				{/if}

				<!-- Step 3: Title -->
				{#if step === 3}
					<div class="wizard-step" class:active={step === 3}>
						<div class="text-center mb-6">
							<span class="text-5xl mb-3 inline-block animate-bounce-cute" aria-hidden="true">📝</span>
							<h2 class="text-3xl font-dancing text-pink-600">Give It a Sweet Title!</h2>
							<p class="text-gray-500 mt-1">Used in notifications and your dashboard</p>
						</div>

						<input
							type="text"
							bind:value={title}
							placeholder="My Valentine Surprise 💌"
							class="input input-bordered w-full rounded-2xl text-lg focus:border-pink-400"
							aria-label="Enter a title for your confession"
						/>
					</div>
				{/if}

				<!-- Step 4: No Options -->
				{#if step === 4}
					<div class="wizard-step" class:active={step === 4}>
						<div class="text-center mb-6">
							<span class="text-5xl mb-3 inline-block animate-pulse-heart" aria-hidden="true">😢</span>
							<h2 class="text-3xl font-dancing text-pink-600">Make "No" Hard to Say!</h2>
							<p class="text-gray-500 mt-1">Select at least 3 — the more, the funnier! ({selectedNoOptions.length} selected)</p>
						</div>

						<!-- Ordinary -->
						<div class="mb-4">
							<h3 class="text-sm font-semibold text-gray-600 mb-2">🙂 Ordinary</h3>
							<div class="flex flex-wrap gap-2">
								{#each noOptionsLibrary.ordinary as option}
									<button
										class="btn btn-sm rounded-full {selectedNoOptions.includes(option) ? 'btn-error' : 'btn-outline border-gray-200 text-gray-500 hover:bg-gray-50'}"
										onclick={() => toggleNoOption(option)}
										aria-label="Toggle: {option}"
										aria-pressed={selectedNoOptions.includes(option)}
									>
										{#if selectedNoOptions.includes(option)}<Check class="w-3 h-3" aria-hidden="true" />{/if}
										{option}
									</button>
								{/each}
							</div>
						</div>

						<!-- Pleading -->
						<div class="mb-4">
							<h3 class="text-sm font-semibold text-gray-600 mb-2">🥺 Pleading</h3>
							<div class="flex flex-wrap gap-2">
								{#each noOptionsLibrary.pleading as option}
									<button
										class="btn btn-sm rounded-full {selectedNoOptions.includes(option) ? 'btn-warning' : 'btn-outline border-gray-200 text-gray-500 hover:bg-gray-50'}"
										onclick={() => toggleNoOption(option)}
										aria-label="Toggle: {option}"
										aria-pressed={selectedNoOptions.includes(option)}
									>
										{#if selectedNoOptions.includes(option)}<Check class="w-3 h-3" aria-hidden="true" />{/if}
										{option}
									</button>
								{/each}
							</div>
						</div>

						<!-- Funny/Troll -->
						<div class="mb-4">
							<h3 class="text-sm font-semibold text-gray-600 mb-2">😂 Funny & Trolly</h3>
							<div class="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
								{#each noOptionsLibrary.funny as option}
									<button
										class="btn btn-sm rounded-full {selectedNoOptions.includes(option) ? 'btn-accent' : 'btn-outline border-gray-200 text-gray-500 hover:bg-gray-50'}"
										onclick={() => toggleNoOption(option)}
										aria-label="Toggle: {option}"
										aria-pressed={selectedNoOptions.includes(option)}
									>
										{#if selectedNoOptions.includes(option)}<Check class="w-3 h-3" aria-hidden="true" />{/if}
										{option}
									</button>
								{/each}
							</div>
						</div>

						<!-- Custom -->
						<div class="flex gap-2 mb-2">
							<input
								type="text"
								bind:value={customNoText}
								placeholder='Add your own "No" text 😏'
								class="input input-bordered input-sm rounded-full flex-1 focus:border-pink-400"
								onkeydown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomNo(); }}}
								aria-label="Enter a custom No button text"
							/>
							<button class="btn btn-sm btn-primary rounded-full" onclick={addCustomNo} aria-label="Add custom No text">
								Add
							</button>
						</div>

						{#if selectedNoOptions.length > 0}
							<p class="text-xs text-pink-500 mt-1">✅ {selectedNoOptions.length} option(s) selected</p>
						{/if}
					</div>
				{/if}

				<!-- Step 5: Photo -->
				{#if step === 5}
					<div class="wizard-step" class:active={step === 5}>
						<div class="text-center mb-6">
							<span class="text-5xl mb-3 inline-block animate-bounce-cute" aria-hidden="true">📸</span>
							<h2 class="text-3xl font-dancing text-pink-600">Add a Special Photo!</h2>
							<p class="text-gray-500 mt-1">Optional — a photo of you two, a cute image, anything! 💕</p>
						</div>

						<div class="flex flex-col items-center gap-4">
							{#if photoPreview}
								<img
									src={photoPreview}
									alt="Preview of your uploaded love photo 💕"
									class="w-48 h-48 rounded-full object-cover border-4 border-pink-300 shadow-lg"
								/>
								<button class="btn btn-sm btn-ghost text-gray-400" onclick={() => { photoFile = null; photoPreview = ''; }}>
									Remove 🗑️
								</button>
							{:else}
								<div class="w-48 h-48 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center border-4 border-dashed border-pink-200">
									<div class="text-center">
										<Image class="w-10 h-10 text-pink-300 mx-auto mb-2" aria-hidden="true" />
										<p class="text-sm text-pink-400">Click to upload</p>
									</div>
								</div>
							{/if}

							<input
								type="file"
								accept="image/jpeg,image/png,image/gif,image/webp"
								onchange={onPhotoSelect}
								class="file-input file-input-bordered file-input-sm w-full max-w-xs rounded-full"
								aria-label="Upload a photo for your confession"
							/>
							<p class="text-xs text-gray-400">JPEG, PNG, GIF, WebP • Max 5MB</p>
						</div>
					</div>
				{/if}

				<!-- Step 6: Final Touches -->
				{#if step === 6}
					<div class="wizard-step" class:active={step === 6}>
						<div class="text-center mb-6">
							<span class="text-5xl mb-3 inline-block animate-pulse-heart" aria-hidden="true">✨</span>
							<h2 class="text-3xl font-dancing text-pink-600">Final Touches!</h2>
							<p class="text-gray-500 mt-1">Add an extra message and pick your theme color</p>
						</div>

						<div class="form-control mb-6">
							<label for="extraMessage" class="label">
								<span class="label-text flex items-center gap-1">
									<MessageCircle class="w-4 h-4" aria-hidden="true" />
									Extra Message (Optional)
								</span>
							</label>
							<textarea
								id="extraMessage"
								bind:value={extraMessage}
								placeholder="Remember our first date? 🥰 Inside jokes welcome!"
								class="textarea textarea-bordered rounded-2xl h-24 focus:border-pink-400"
								aria-label="Enter an optional extra message"
							></textarea>
						</div>

						<div class="form-control mb-6">
							<label for="themeColor" class="label">
								<span class="label-text flex items-center gap-1">
									<Palette class="w-4 h-4" aria-hidden="true" />
									Theme Color 🌈
								</span>
							</label>
							<div class="flex items-center gap-4">
								<input
									id="themeColor"
									type="color"
									bind:value={themeColor}
									class="w-12 h-12 rounded-full cursor-pointer border-2 border-pink-200"
									aria-label="Choose a theme color for your confession page"
								/>
								<div class="flex gap-2 flex-wrap">
									{#each ['#fce4ec', '#f3e5f5', '#e8eaf6', '#e0f7fa', '#fff3e0', '#fce4ec'] as color}
										<button
											class="w-8 h-8 rounded-full border-2 {themeColor === color ? 'border-pink-500 ring-2 ring-pink-300' : 'border-gray-200'}"
											style="background-color: {color}"
											onclick={() => themeColor = color}
											aria-label="Select {color} theme color"
										></button>
									{/each}
								</div>
							</div>
						</div>

						<!-- Preview Summary -->
						<div class="bg-pink-50 rounded-2xl p-6 text-center">
							<h3 class="font-dancing text-2xl text-pink-600 mb-2">Preview Summary 💕</h3>
							<p><strong>Question:</strong> {questionText}</p>
							<p><strong>To:</strong> {crushName}</p>
							<p><strong>Title:</strong> {title}</p>
							<p><strong>"No" options:</strong> {selectedNoOptions.length}</p>
							<p><strong>Photo:</strong> {photoFile ? 'Uploaded! 📸' : 'None (that\'s okay!)'}</p>
							{#if extraMessage}
								<p><strong>Extra note:</strong> {extraMessage}</p>
							{/if}
						</div>
					</div>
				{/if}

				<!-- Navigation Buttons -->
				<div class="flex justify-between items-center mt-8">
					<button
						class="btn btn-ghost rounded-full gap-1"
						onclick={prevStep}
						disabled={step === 1}
						aria-label="Go to previous step"
					>
						<ArrowLeft class="w-4 h-4" aria-hidden="true" />
						Back
					</button>

					{#if step < totalSteps}
						<button
							class="btn btn-primary rounded-full gap-1 shadow-md hover:scale-105 transition-transform"
							onclick={nextStep}
							disabled={!canProceed}
							aria-label="Go to next step"
						>
							Next
							<ArrowRight class="w-4 h-4" aria-hidden="true" />
							💕
						</button>
					{:else}
						<!-- Submit Form -->
						<form method="POST" enctype="multipart/form-data" use:enhance={({ formData }) => {
							if (photoFile) {
								formData.set('photo', photoFile);
							}
							loading = true;
							return async ({ update }) => {
								loading = false;
								await update();
							};
						}}>
							<input type="hidden" name="questionText" value={questionText} />
							<input type="hidden" name="crushName" value={crushName} />
							<input type="hidden" name="title" value={title} />
							<input type="hidden" name="noOptions" value={JSON.stringify(selectedNoOptions)} />
							<input type="hidden" name="extraMessage" value={extraMessage} />
							<input type="hidden" name="themeColor" value={themeColor} />
							<button
								type="submit"
								class="btn btn-primary btn-lg rounded-full gap-2 shadow-lg glow-pink hover:scale-105 transition-transform"
								disabled={loading || !canProceed}
								aria-label="Send your love confession!"
							>
								{#if loading}
									<span class="loading loading-spinner" aria-hidden="true"></span>
									Sending love...
								{:else}
									<Sparkles class="w-5 h-5" aria-hidden="true" />
									Send Love! 💖
								{/if}
							</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
