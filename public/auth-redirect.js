(function redirectIdentityTokens() {
  var identityToken = /^#(?:confirmation_token|invite_token|recovery_token|email_change_token)=/
  if (identityToken.test(window.location.hash) && !window.location.pathname.startsWith('/admin')) {
    window.location.replace('/admin/' + window.location.hash)
  }
}())
