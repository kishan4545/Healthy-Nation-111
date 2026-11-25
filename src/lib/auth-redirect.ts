export function getAuthRedirectUrl(path: "/account" | "/admin"): string {
  const redirectBase =
    import.meta.env["VITE_AUTH_REDIRECT_URL"] || window.location.origin;
  return new URL(path, redirectBase).toString();
}

export function getSignInErrorMessage(error: { message: string }): string {
  const message = error.message.toLowerCase();
  if (message.includes("redirect") || message.includes("allow list")) {
    return "Supabase blocked this deployment URL. Add this site's account and admin URLs to Authentication > URL Configuration > Redirect URLs.";
  }
  if (message.includes("email") || message.includes("smtp")) {
    return "Supabase could not send the sign-in email. Check that email sign-in is enabled and your Supabase email provider is configured.";
  }
  return "We couldn't send the sign-in link. Please try again.";
}
