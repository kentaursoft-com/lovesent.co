<script lang="ts">
	import { Heart, Sparkles, ArrowRight, Shield, Share2, Smile } from 'lucide-svelte';
	import { getRandomQuote } from '$lib/utils';
	import { onMount } from 'svelte';

	let { data } = $props();
	let quote = $state(getRandomQuote());

	onMount(() => {
		const interval = setInterval(() => {
			quote = getRandomQuote();
		}, 8000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Love Sent 💖 — Send Heartfelt Confessions That Can't Be Ignored!</title>
	<meta name="description" content="Create personalized romantic proposals with playful interactions. Will they say yes? 💕 The cutest confession platform on the internet!" />
	<meta property="og:title" content="Love Sent 💖 — Romantic Confession Platform" />
	<meta property="og:description" content="Send heartfelt confessions that can't be ignored! Create adorable, interactive proposal pages." />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://lovesent.me" />
</svelte:head>

<!-- Hero Section -->
<section class="min-h-[80vh] flex flex-col items-center justify-center px-3 sm:px-4 py-10 sm:py-16 bg-love-gradient relative overflow-hidden">
	<!-- Decorative elements -->
	<div class="absolute top-10 left-4 sm:left-10 text-4xl sm:text-6xl opacity-20 animate-bounce-cute" aria-hidden="true">💖</div>
	<div class="absolute top-20 right-4 sm:right-16 text-3xl sm:text-4xl opacity-15 animate-pulse-heart" aria-hidden="true">🌸</div>
	<div class="absolute bottom-20 left-4 sm:left-20 text-4xl sm:text-5xl opacity-20 animate-bounce-cute" style="animation-delay: 1s;" aria-hidden="true">💕</div>
	<div class="absolute bottom-32 right-4 sm:right-10 text-3xl sm:text-4xl opacity-15 animate-pulse-heart" style="animation-delay: 0.5s;" aria-hidden="true">💜</div>

	<div class="text-center max-w-3xl mx-auto relative z-10">
		<!-- Logo / Title -->
		<div class="mb-6 animate-bounce-cute">
			<span class="text-7xl" aria-hidden="true">💌</span>
		</div>

		<h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-dancing text-pink-600 mb-4 leading-tight">
			Love Sent
			<span class="text-3xl sm:text-4xl md:text-5xl" aria-hidden="true">💖</span>
		</h1>

		<p class="text-lg sm:text-xl md:text-2xl text-gray-600 mb-3 font-light px-2">
			Send heartfelt confessions that <strong class="text-pink-500">can't be ignored!</strong> 😍
		</p>

		<p class="text-sm sm:text-base text-gray-500 mb-8 max-w-lg mx-auto px-2">
			Create personalized, ultra-cute proposal pages with playful "No" buttons
			and celebrate with confetti when they say Yes! 🎉
		</p>

		<!-- CTA Buttons -->
		<div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-2">
			{#if data.user}
				<a href="/create" class="btn btn-primary btn-lg rounded-full shadow-lg glow-pink gap-2 text-lg px-8 hover:scale-105 transition-transform" aria-label="Create a new confession">
					<Sparkles class="w-5 h-5" aria-hidden="true" />
					Create Confession ✨
				</a>
				<a href="/dashboard" class="btn btn-outline btn-lg rounded-full gap-2 text-lg px-8 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400" aria-label="Go to your dashboard">
					My Dashboard 💕
				</a>
			{:else}
				<a href="/signup" class="btn btn-primary btn-lg rounded-full shadow-lg glow-pink gap-2 text-lg px-8 hover:scale-105 transition-transform" aria-label="Sign up for a free account">
					<Heart class="w-5 h-5 fill-white" aria-hidden="true" />
					Sign Up Free 🥰
				</a>
				<a href="/login" class="btn btn-outline btn-lg rounded-full gap-2 text-lg px-8 border-pink-300 text-pink-600 hover:bg-pink-50 hover:border-pink-400" aria-label="Log in to your account">
					Log In ❤️
					<ArrowRight class="w-5 h-5" aria-hidden="true" />
				</a>
			{/if}
		</div>

		<!-- Demo Card Preview -->
		<div class="card bg-white/90 backdrop-blur shadow-xl max-w-md mx-auto rounded-3xl border border-pink-100 overflow-hidden card-cute mx-2 sm:mx-auto">
			<div class="card-body items-center text-center p-8">
				<div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center mb-3 shadow-md">
					<span class="text-3xl" aria-hidden="true">😍</span>
				</div>
				<h3 class="card-title font-dancing text-3xl text-pink-600">Alex,</h3>
				<p class="text-xl text-gray-700 mb-4">Will You Be My Valentine? ❤️</p>
				<div class="flex gap-3 flex-wrap justify-center">
					<button class="btn btn-primary btn-lg rounded-full shadow-md px-8" disabled aria-label="Demo Yes button">
						Yes! 💕
					</button>
					<button class="btn btn-outline border-pink-300 text-pink-500 rounded-full px-6" disabled aria-label="Demo No button">
						Nope 😢
					</button>
				</div>
				<p class="text-xs text-gray-400 mt-3 italic" aria-hidden="true">
					(Psst... the No button runs away! 😏)
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Features Section -->
<section class="py-20 px-4 bg-white/50" aria-labelledby="features-heading">
	<div class="max-w-6xl mx-auto">
		<h2 id="features-heading" class="text-4xl font-dancing text-center text-pink-600 mb-4">
			Why Love Sent? 💕
		</h2>
		<p class="text-center text-gray-500 mb-12 max-w-xl mx-auto">
			Make your confession unforgettable with these adorable features!
		</p>

		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			<!-- Feature 1 -->
			<div class="card bg-white shadow-md rounded-3xl border border-pink-50 card-cute">
				<div class="card-body items-center text-center">
					<div class="w-16 h-16 rounded-full bg-pink-100 flex items-center justify-center mb-3">
						<Heart class="w-8 h-8 text-pink-500 fill-pink-500" aria-hidden="true" />
					</div>
					<h3 class="card-title text-pink-600 text-lg">Impossible to Reject 💪</h3>
					<p class="text-gray-500 text-sm">
						The "No" button runs away, shrinks, and changes text — making it adorably hard to refuse! 😏
					</p>
				</div>
			</div>

			<!-- Feature 2 -->
			<div class="card bg-white shadow-md rounded-3xl border border-pink-50 card-cute">
				<div class="card-body items-center text-center">
					<div class="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-3">
						<Sparkles class="w-8 h-8 text-purple-500" aria-hidden="true" />
					</div>
					<h3 class="card-title text-purple-600 text-lg">Confetti Celebrations 🎉</h3>
					<p class="text-gray-500 text-sm">
						When they say "Yes", the screen explodes with heart-shaped confetti and joyful animations!
					</p>
				</div>
			</div>

			<!-- Feature 3 -->
			<div class="card bg-white shadow-md rounded-3xl border border-pink-50 card-cute">
				<div class="card-body items-center text-center">
					<div class="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
						<Share2 class="w-8 h-8 text-blue-500" aria-hidden="true" />
					</div>
					<h3 class="card-title text-blue-600 text-lg">Easy Sharing 📲</h3>
					<p class="text-gray-500 text-sm">
						Share your confession link on any platform — Twitter, WhatsApp, Instagram, and more!
					</p>
				</div>
			</div>

			<!-- Feature 4 -->
			<div class="card bg-white shadow-md rounded-3xl border border-pink-50 card-cute">
				<div class="card-body items-center text-center">
					<div class="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mb-3">
						<Smile class="w-8 h-8 text-amber-500" aria-hidden="true" />
					</div>
					<h3 class="card-title text-amber-600 text-lg">Totally Customizable 🎨</h3>
					<p class="text-gray-500 text-sm">
						Custom questions, photos, themes, funny "No" texts — make it uniquely yours!
					</p>
				</div>
			</div>

			<!-- Feature 5 -->
			<div class="card bg-white shadow-md rounded-3xl border border-pink-50 card-cute">
				<div class="card-body items-center text-center">
					<div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
						<Shield class="w-8 h-8 text-green-500" aria-hidden="true" />
					</div>
					<h3 class="card-title text-green-600 text-lg">Instant Notifications 📧</h3>
					<p class="text-gray-500 text-sm">
						Get an email the moment they accept — so you can celebrate together! 🥰
					</p>
				</div>
			</div>

			<!-- Feature 6 -->
			<div class="card bg-white shadow-md rounded-3xl border border-pink-50 card-cute">
				<div class="card-body items-center text-center">
					<div class="w-16 h-16 rounded-full bg-rose-100 flex items-center justify-center mb-3">
						<span class="text-3xl" aria-hidden="true">📸</span>
					</div>
					<h3 class="card-title text-rose-600 text-lg">Screenshot & Share 🖼️</h3>
					<p class="text-gray-500 text-sm">
						Capture the happy moment as a beautiful screenshot — ready for social media!
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- How It Works Section -->
<section class="py-20 px-4 bg-love-gradient" aria-labelledby="how-heading">
	<div class="max-w-4xl mx-auto">
		<h2 id="how-heading" class="text-4xl font-dancing text-center text-pink-600 mb-12">
			How It Works 🌟
		</h2>

		<div class="flex flex-col gap-8">
			{#each [
				{ step: 1, emoji: '📝', title: 'Create Your Confession', desc: 'Pick a cute question, add a photo, choose funny "No" button texts, and personalize everything!' },
				{ step: 2, emoji: '🔗', title: 'Share the Link', desc: 'Get a unique link and send it to your crush via text, DM, email, or carrier pigeon! 🐦' },
				{ step: 3, emoji: '😍', title: 'They Interact', desc: 'They try to click "No"... but it runs away! The Yes button grows bigger and more irresistible!' },
				{ step: 4, emoji: '🎉', title: 'Celebrate Together!', desc: 'Confetti explodes, you get notified, and love wins! Screenshot and share the joy! 💖' }
			] as step}
				<div class="flex items-start gap-6 bg-white/90 backdrop-blur rounded-3xl p-6 shadow-md border border-pink-50 card-cute">
					<div class="flex-shrink-0 w-16 h-16 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl shadow-md">
						{step.step}
					</div>
					<div>
						<h3 class="text-xl font-semibold text-gray-700 mb-1">
							<span aria-hidden="true">{step.emoji}</span> {step.title}
						</h3>
						<p class="text-gray-500">{step.desc}</p>
					</div>
				</div>
			{/each}
		</div>

		<!-- Bottom CTA -->
		<div class="text-center mt-12">
			<a href={data.user ? '/create' : '/signup'} class="btn btn-primary btn-lg rounded-full shadow-lg glow-pink gap-2 text-lg px-10 hover:scale-105 transition-transform" aria-label="{data.user ? 'Create your confession' : 'Get started for free'}">
				{data.user ? 'Create Your Confession ✨' : 'Get Started Free 💖'}
			</a>
		</div>
	</div>
</section>

<!-- Love Quote Section -->
<section class="py-12 px-4 bg-white/50 text-center" aria-label="Inspirational love quote">
	<div class="max-w-2xl mx-auto">
		<p class="text-2xl font-dancing text-pink-500 italic transition-all duration-500">
			{quote}
		</p>
	</div>
</section>
