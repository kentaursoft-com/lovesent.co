<script lang="ts">
	import { Heart, Plus, Copy, ExternalLink, Eye, Check, Camera, Share2 } from 'lucide-svelte';
	import { toasts } from '$lib/stores';
	import { getShareUrl } from '$lib/utils';

	let { data } = $props();

	async function copyLink(slug: string) {
		const url = `${window.location.origin}/confess/${slug}`;
		try {
			await navigator.clipboard.writeText(url);
			toasts.success('Link copied! Send it with love 💕');
		} catch {
			// Fallback
			const input = document.createElement('input');
			input.value = url;
			document.body.appendChild(input);
			input.select();
			document.execCommand('copy');
			document.body.removeChild(input);
			toasts.success('Link copied! 💖');
		}
	}

	async function shareLink(slug: string, crushName: string) {
		const url = `${window.location.origin}/confess/${slug}`;
		if (navigator.share) {
			try {
				await navigator.share({
					title: 'Love Sent 💖',
					text: `I have a special confession for ${crushName}! 💕`,
					url
				});
			} catch {
				// User cancelled share
			}
		} else {
			copyLink(slug);
		}
	}
</script>

<svelte:head>
	<title>My Dashboard 💌 — Love Sent</title>
	<meta name="description" content="Manage your love confessions and track who said Yes!" />
</svelte:head>

<div class="min-h-[80vh] px-3 sm:px-4 py-6 sm:py-8 bg-love-gradient">
	<div class="max-w-6xl mx-auto">
		<!-- Header -->
		<div class="text-center mb-6 sm:mb-10">
			<h1 class="text-3xl sm:text-4xl md:text-5xl font-dancing text-pink-600 mb-2">Your Love Confessions 💌</h1>
			<p class="text-gray-500 text-sm sm:text-base">Track your confessions, see who said Yes, and share the love!</p>
			<p class="text-xs sm:text-sm text-gray-400 mt-1">Logged in as {data.user?.email} 💕</p>
		</div>

		<!-- Confessions Grid -->
		{#if data.confessions.length === 0}
			<!-- Empty State -->
			<div class="flex flex-col items-center justify-center py-20">
				<div class="w-24 h-24 rounded-full bg-pink-100 flex items-center justify-center mb-6 animate-bounce-cute">
					<span class="text-5xl" aria-hidden="true">💝</span>
				</div>
				<h2 class="text-2xl font-dancing text-pink-600 mb-2">No loves sent yet? 🥺</h2>
				<p class="text-gray-500 mb-6">Let's fix that! Create your first adorable confession.</p>
				<a href="/create" class="btn btn-primary btn-lg rounded-full shadow-lg glow-pink gap-2 hover:scale-105 transition-transform" aria-label="Create your first confession">
					<Plus class="w-5 h-5" aria-hidden="true" />
					Create First Confession 🥰
				</a>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{#each data.confessions as confession}
					<div class="card bg-white/95 backdrop-blur shadow-lg rounded-3xl border border-pink-100 card-cute overflow-hidden">
						<!-- Status Badge -->
						<div class="px-6 pt-5">
							{#if confession.accepted}
								<div class="badge badge-success gap-1 rounded-full px-3 py-3">
									<Check class="w-3 h-3" aria-hidden="true" />
									Accepted! 💖
								</div>
							{:else}
								<div class="badge badge-warning gap-1 rounded-full px-3 py-3">
									<Heart class="w-3 h-3" aria-hidden="true" />
									Pending 😊
								</div>
							{/if}
						</div>

						<div class="card-body px-6 pb-6 pt-3">
							<!-- Title & Crush -->
							<h3 class="card-title font-dancing text-2xl text-pink-600">
								{confession.title}
							</h3>
							<p class="text-gray-600">
								To: <strong class="text-pink-500">{confession.crushName}</strong> ❤️
							</p>
							<p class="text-gray-500 text-sm truncate">{confession.questionText}</p>

							<!-- Stats -->
							<div class="flex items-center gap-4 text-sm text-gray-400 mt-2">
								<span class="flex items-center gap-1">
									<Eye class="w-3 h-3" aria-hidden="true" />
									{confession.views || 0} views
								</span>
								{#if confession.accepted && confession.acceptedAt}
									<span class="text-green-500">
										✓ Accepted {new Date(confession.acceptedAt).toLocaleDateString()}
									</span>
								{/if}
							</div>

							<!-- Actions -->
							<div class="card-actions mt-4 flex flex-wrap gap-2">
								<a
									href="/confess/{confession.uniqueSlug}"
									class="btn btn-sm btn-outline border-pink-300 text-pink-500 rounded-full gap-1"
									target="_blank"
									aria-label="View confession page for {confession.crushName}"
								>
									<ExternalLink class="w-3 h-3" aria-hidden="true" />
									View
								</a>
								<button
									class="btn btn-sm btn-primary rounded-full gap-1"
									onclick={() => copyLink(confession.uniqueSlug)}
									aria-label="Copy confession link for {confession.crushName}"
								>
									<Copy class="w-3 h-3" aria-hidden="true" />
									Copy Link
								</button>
								<button
									class="btn btn-sm btn-secondary rounded-full gap-1"
									onclick={() => shareLink(confession.uniqueSlug, confession.crushName)}
									aria-label="Share confession for {confession.crushName}"
								>
									<Share2 class="w-3 h-3" aria-hidden="true" />
									Share
								</button>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{/if}

		<!-- Create New FAB -->
		<a
			href="/create"
			class="btn btn-primary btn-lg rounded-full shadow-xl glow-pink fixed bottom-6 right-6 z-50 gap-2 hover:scale-110 transition-transform"
			aria-label="Create a new confession"
		>
			<Plus class="w-6 h-6" aria-hidden="true" />
			<span class="hidden sm:inline">Create New</span>
			<span aria-hidden="true">✨</span>
		</a>
	</div>
</div>
