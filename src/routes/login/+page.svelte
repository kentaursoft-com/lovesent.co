<script lang="ts">
	import { Heart, Mail, Lock, LogIn } from 'lucide-svelte';
	import { enhance } from '$app/forms';
	import { toasts } from '$lib/stores';

	let { form } = $props();
	let loading = $state(false);

	$effect(() => {
		if (form?.error) {
			toasts.error(form.error);
		}
	});
</script>

<svelte:head>
	<title>Log In ❤️ — Love Sent</title>
	<meta name="description" content="Log in to your Love Sent account and continue spreading love!" />
</svelte:head>

<div class="min-h-[80vh] flex items-center justify-center px-3 sm:px-4 py-8 sm:py-12 bg-love-gradient">
	<div class="card bg-white/95 backdrop-blur shadow-xl rounded-3xl w-full max-w-md border border-pink-100 card-cute">
		<div class="card-body p-8">
			<!-- Header -->
			<div class="text-center mb-6">
				<div class="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center mx-auto mb-4 shadow-md animate-pulse-heart">
					<Heart class="w-10 h-10 text-pink-500 fill-pink-500" aria-hidden="true" />
				</div>
				<h1 class="text-4xl font-dancing text-pink-600">Welcome Back! 😘</h1>
				<p class="text-gray-500 mt-2">Back to spreading love!</p>
			</div>

			<!-- Form -->
			<form method="POST" use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					loading = false;
					await update();
				};
			}}>
				<div class="form-control mb-4">
					<label for="email" class="label">
						<span class="label-text text-gray-600 flex items-center gap-1">
							<Mail class="w-4 h-4" aria-hidden="true" /> Email 💌
						</span>
					</label>
					<input
						id="email"
						type="email"
						name="email"
						placeholder="your@email.com"
						class="input input-bordered rounded-2xl w-full focus:border-pink-400 focus:ring-pink-300"
						required
						autocomplete="email"
						aria-label="Your email address"
					/>
				</div>

				<div class="form-control mb-6">
					<label for="password" class="label">
						<span class="label-text text-gray-600 flex items-center gap-1">
							<Lock class="w-4 h-4" aria-hidden="true" /> Password 🔒
						</span>
					</label>
					<input
						id="password"
						type="password"
						name="password"
						placeholder="Your secret password"
						class="input input-bordered rounded-2xl w-full focus:border-pink-400 focus:ring-pink-300"
						required
						autocomplete="current-password"
						aria-label="Your password"
					/>
				</div>

				{#if form?.error}
					<div class="alert alert-error rounded-2xl mb-4" role="alert">
						<span>😢 {form.error}</span>
					</div>
				{/if}

				<button
					type="submit"
					class="btn btn-primary w-full rounded-full shadow-lg text-lg gap-2 hover:scale-[1.02] transition-transform"
					disabled={loading}
					aria-label="Log in to your account"
				>
					{#if loading}
						<span class="loading loading-spinner" aria-hidden="true"></span>
						Finding your love...
					{:else}
						<LogIn class="w-5 h-5" aria-hidden="true" />
						Log In ❤️
					{/if}
				</button>
			</form>

			<div class="divider text-gray-400">or</div>

			<p class="text-center text-gray-500">
				Don't have an account?
				<a href="/signup" class="text-pink-500 font-semibold hover:text-pink-600 underline">
					Sign Up Free 🥰
				</a>
			</p>
		</div>
	</div>
</div>
