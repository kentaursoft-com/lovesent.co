<script lang="ts">
	import { onMount } from 'svelte';
	import { getShareUrl } from '$lib/utils';

	let { data } = $props();
	const c = data.confession;

	// State
	let noClicks = $state(0);
	let currentNoIndex = $state(0);
	let yesScale = $state(1);
	let noPosition = $state({ x: 50, y: 50 }); // percentage within the button zone
	let noScale = $state(1);
	let noText = $state(c.noOptions[0] || 'No 😢');
	let accepted = $state(c.accepted || false);
	let showOverlay = $state(false);
	let showPersistentMessage = $state(false);
	let mounted = $state(false);
	let containerEl: HTMLDivElement;
	let buttonZoneEl: HTMLDivElement;

	// Heart emojis for floating animation
	const heartEmojis = ['❤️', '💖', '💕', '🌸', '💜', '💛', '💗', '💓', '💞', '💝'];

	onMount(() => {
		mounted = true;
		if (c.accepted) {
			showOverlay = true;
		}
	});

	function onNoClick() {
		noClicks++;
		currentNoIndex = (currentNoIndex + 1) % c.noOptions.length;
		noText = c.noOptions[currentNoIndex];

		// Move the No button to a random position WITHIN the button zone (percentage-based)
		// Keeps it within 5%-85% range so the button doesn't clip edges
		noPosition = {
			x: 5 + Math.random() * 80,
			y: 5 + Math.random() * 70
		};

		// Grow Yes button
		yesScale = 1 + noClicks * 0.12;

		// Shrink No button after many attempts
		if (noClicks > 6) {
			noScale = Math.max(0.4, 1 - (noClicks - 6) * 0.08);
		}

		// Shake screen every 3 clicks
		if (noClicks % 3 === 0) {
			shakeScreen();
		}

		// Show persistent message after 15+ clicks
		if (noClicks >= 15) {
			showPersistentMessage = true;
		}
	}

	function shakeScreen() {
		document.body.classList.add('shake');
		setTimeout(() => document.body.classList.remove('shake'), 500);
	}

	async function onYesClick() {
		accepted = true;
		showOverlay = true;

		// Fire confetti!
		if (mounted) {
			try {
				const confettiModule = await import('canvas-confetti');
				const confetti = confettiModule.default;

				// Initial burst
				confetti({
					particleCount: 200,
					spread: 120,
					origin: { y: 0.6 },
					colors: ['#ff69b4', '#ff1493', '#ffffff', '#ffd700', '#d946ef', '#f472b6']
				});

				// Second burst
				setTimeout(() => {
					confetti({
						particleCount: 150,
						angle: 60,
						spread: 80,
						origin: { x: 0 },
						colors: ['#ff69b4', '#ff1493', '#ffffff']
					});
				}, 250);

				// Third burst
				setTimeout(() => {
					confetti({
						particleCount: 150,
						angle: 120,
						spread: 80,
						origin: { x: 1 },
						colors: ['#ff69b4', '#ff1493', '#ffffff']
					});
				}, 400);

				// Continuous hearts
				const duration = 4000;
				const end = Date.now() + duration;
				const interval = setInterval(() => {
					if (Date.now() > end) {
						clearInterval(interval);
						return;
					}
					confetti({
						particleCount: 10,
						angle: 90,
						spread: 360,
						origin: { x: Math.random(), y: Math.random() * 0.3 },
						colors: ['#ff69b4', '#ff1493', '#d946ef'],
						ticks: 200,
						gravity: 0.5,
						scalar: 1.5
					});
				}, 100);
			} catch (e) {
				console.log('Confetti not available', e);
			}
		}

		// Send acceptance to server
		try {
			await fetch(`/api/accept/${c.uniqueSlug}`, { method: 'POST' });
		} catch {
			// Non-critical
		}

		// Create celebration hearts
		createCelebrationHearts();
	}

	function createCelebrationHearts() {
		if (!containerEl) return;
		for (let i = 0; i < 40; i++) {
			setTimeout(() => {
				const heart = document.createElement('span');
				heart.className = 'heart-float';
				heart.style.left = `${Math.random() * 100}%`;
				heart.style.animationDuration = `${3 + Math.random() * 5}s`;
				heart.style.fontSize = `${16 + Math.random() * 32}px`;
				heart.style.opacity = `${Math.random() * 0.6 + 0.4}`;
				heart.innerText = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
				containerEl.appendChild(heart);
				setTimeout(() => heart.remove(), 8000);
			}, i * 100);
		}
	}

	function shareResult() {
		const text = `${c.crushName} said YES on Love Sent! 💖🎉`;
		const url = window.location.href;
		if (navigator.share) {
			navigator.share({ title: 'Love Accepted! 💖', text, url });
		} else {
			window.open(getShareUrl('twitter', text, url), '_blank');
		}
	}

	async function takeScreenshot() {
		try {
			const html2canvas = (await import('html2canvas')).default;
			const overlay = document.getElementById('acceptance-overlay');
			if (overlay) {
				const canvas = await html2canvas(overlay);
				const link = document.createElement('a');
				link.download = `love-accepted-${c.crushName}.png`;
				link.href = canvas.toDataURL();
				link.click();
			}
		} catch {
			// Fallback: just show share options
			shareResult();
		}
	}
</script>

<svelte:head>
	<title>{c.crushName}, {c.questionText} 💖 — Love Sent</title>
	<meta name="description" content="A special romantic confession for {c.crushName} on Love Sent 💕" />
	<meta property="og:title" content="{c.crushName}, {c.questionText} 💖" />
	<meta property="og:description" content="Someone has a heartfelt confession for {c.crushName}! Open to find out... 🥰" />
	<meta property="og:type" content="website" />
</svelte:head>

<div
	bind:this={containerEl}
	class="min-h-screen flex flex-col items-center px-3 sm:px-4 py-4 sm:py-8 relative overflow-hidden"
	style="background: linear-gradient(135deg, {c.themeColor || '#fce4ec'} 0%, #f3e5f5 50%, #e8eaf6 100%);"
>
	<!-- Floating hearts background -->
	<div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
		{#each Array(12) as _, i}
			<span
				class="heart-float absolute"
				style="left: {(i * 8.3)}%; animation-duration: {6 + (i % 5) * 2}s; font-size: {14 + (i % 4) * 6}px; opacity: {0.2 + (i % 3) * 0.15}; animation-delay: {i * 0.5}s;"
			>
				{heartEmojis[i % heartEmojis.length]}
			</span>
		{/each}
	</div>

	<!-- Main Confession Content -->
	{#if !showOverlay}
		<div class="relative z-10 flex flex-col items-center w-full max-w-lg mx-auto text-center pt-4 sm:pt-8">
			<!-- Photo -->
			{#if c.photoUrl}
				<img
					src={c.photoUrl}
					alt="Special photo for {c.crushName} 💖"
					class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full object-cover border-[6px] sm:border-8 border-white shadow-xl mb-4 sm:mb-6 animate-pulse-heart"
				/>
			{:else}
				<div class="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-pink-300 to-purple-300 flex items-center justify-center border-[6px] sm:border-8 border-white shadow-xl mb-4 sm:mb-6 animate-pulse-heart">
					<span class="text-5xl sm:text-6xl" aria-hidden="true">💝</span>
				</div>
			{/if}

			<!-- Question -->
			<h1 class="text-2xl sm:text-3xl md:text-5xl font-dancing text-pink-700 mb-2 sm:mb-3 leading-tight px-2">
				{c.crushName},
			</h1>
			<h2 class="text-xl sm:text-2xl md:text-4xl font-dancing text-pink-600 mb-3 sm:mb-4 px-2">
				{c.questionText} 😍
			</h2>

			<!-- Extra Message -->
			{#if c.extraMessage}
				<p class="text-base sm:text-lg text-gray-600 mb-4 sm:mb-6 italic bg-white/60 rounded-2xl px-4 sm:px-6 py-2 sm:py-3 backdrop-blur mx-2">
					"{c.extraMessage}" 💕
				</p>
			{/if}

			<!-- YES Button -->
			<button
				id="yes-btn"
				class="btn btn-primary btn-lg rounded-full shadow-xl text-lg sm:text-xl px-8 sm:px-10 mb-4 hover:shadow-2xl glow-pink active:scale-95"
				style="transform: scale({yesScale}); transition: transform 0.4s ease;"
				onclick={onYesClick}
				aria-label="Yes! Accept the confession with joy! 💖"
			>
				Yes! 💕
			</button>

			<!-- Button Zone — the No button moves ONLY within this safe area -->
			<div
				bind:this={buttonZoneEl}
				class="relative w-full mt-2"
				style="height: 140px; min-height: 120px;"
				aria-label="Button zone where the No button moves around"
			>
				{#if mounted}
					<button
						id="no-btn"
						class="btn btn-outline border-pink-300 text-pink-500 rounded-full shadow-md absolute whitespace-nowrap touch-manipulation"
						style="
							left: {noPosition.x}%;
							top: {noPosition.y}%;
							transform: translate(-50%, -50%) scale({noScale});
							transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
							z-index: 20;
						"
						onclick={onNoClick}
						aria-label="No button: Try clicking it... if you can! 😏"
					>
						{noText}
					</button>
				{/if}
			</div>

			<!-- Persistent message after many No clicks -->
			{#if showPersistentMessage}
				<div class="mt-2 p-3 sm:p-4 bg-white/80 backdrop-blur rounded-2xl shadow-md animate-bounce-cute mx-2">
					<p class="text-pink-600 font-medium text-sm sm:text-base">
						Okay, you're persistent! 😂 But Yes is still waiting... 💕
					</p>
				</div>
			{/if}

			<!-- No click counter (subtle) -->
			{#if noClicks > 0 && noClicks < 15}
				<p class="text-xs sm:text-sm text-pink-400 mt-3 opacity-70" aria-hidden="true">
					{#if noClicks < 5}
						The No button is getting nervous! 😅
					{:else if noClicks < 10}
						It's running away from you! 🏃💨
					{:else}
						Almost gave up? Just say Yes! 🥺💖
					{/if}
				</p>
			{/if}
		</div>
	{/if}

	<!-- Acceptance Overlay -->
	{#if showOverlay}
		<div id="acceptance-overlay" class="relative z-20 flex flex-col items-center w-full max-w-lg mx-auto text-center animate-bounce-cute my-auto">
			<div class="bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-6 sm:p-8 md:p-12 border border-pink-100 mx-2 w-full">
				<div class="text-4xl sm:text-6xl mb-3 sm:mb-4" aria-hidden="true">🎉💖🎉</div>

				<h1 class="text-3xl sm:text-4xl md:text-5xl font-dancing text-pink-600 mb-3 sm:mb-4">
					YAYYYYY! 🥰
				</h1>

				<h2 class="text-xl sm:text-2xl font-dancing text-pink-500 mb-3 sm:mb-4">
					{c.crushName} Accepted! 💖💖💖
				</h2>

				<p class="text-base sm:text-lg text-gray-600 mb-2">
					You just made someone very happy!
				</p>

				<p class="text-lg sm:text-xl text-pink-500 font-medium mb-4 sm:mb-6">
					Your heart just fluttered! 💞
				</p>

				{#if c.extraMessage}
					<div class="bg-pink-50 rounded-2xl p-3 sm:p-4 mb-4 sm:mb-6">
						<p class="text-gray-600 italic text-sm sm:text-base">"{c.extraMessage}" 💕</p>
					</div>
				{/if}

				<div class="text-3xl sm:text-4xl mb-4 sm:mb-6" aria-hidden="true">
					✨🌹💕🌸💖✨
				</div>

				<!-- Action Buttons -->
				<div class="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3 justify-center">
					<button
						class="btn btn-primary rounded-full gap-1 shadow-md w-full sm:w-auto"
						onclick={shareResult}
						aria-label="Share this happy moment"
					>
						📱 Share the Joy!
					</button>
					<button
						class="btn btn-secondary rounded-full gap-1 shadow-md w-full sm:w-auto"
						onclick={takeScreenshot}
						aria-label="Take a screenshot of this moment"
					>
						📸 Screenshot
					</button>
				</div>

				<!-- Social Share Links -->
				<div class="flex flex-wrap gap-2 sm:gap-3 justify-center mt-4 sm:mt-6">
					{#each ['twitter', 'whatsapp', 'facebook', 'telegram'] as platform}
						<a
							href={getShareUrl(platform, `${c.crushName} said YES on Love Sent! 💖🎉`, typeof window !== 'undefined' ? window.location.href : `https://lovesent.me/confess/${c.uniqueSlug}`)}
							target="_blank"
							rel="noopener noreferrer"
							class="btn btn-sm btn-outline rounded-full capitalize border-pink-200 text-pink-500 hover:bg-pink-50"
							aria-label="Share on {platform}"
						>
							{#if platform === 'twitter'}🐦{:else if platform === 'whatsapp'}💬{:else if platform === 'facebook'}📘{:else}✈️{/if}
							{platform}
						</a>
					{/each}
				</div>

				<p class="text-xs sm:text-sm text-gray-400 mt-4 sm:mt-6">
					Love is in the air! 🌹 — <a href="/" class="text-pink-500 underline">lovesent.me</a>
				</p>
			</div>
		</div>
	{/if}
</div>
