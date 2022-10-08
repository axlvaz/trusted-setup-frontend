import { useCallback } from 'react'
import api from '../api'
import OAuthPopup from '../OAuthPopup'
import { ethAddressToIdentity, githubHandleToIdentity, isSuccessRes, parseErrorMessage } from '../utils'
import { useAuthStore, OAuthRes } from '../store/auth'

export default function useAuthenticate() {
  const authStore = useAuthStore()
  const signinGithub = useCallback(async () => {
    try {
      const requestLinks = await api.getRequestLink()

      const popupHeight = '600px'
      const popupWidth = '400px'
      const top = '0px'
      const left = '0px'

      const popup = OAuthPopup.open(
        'oauth2-authorize-popup',
        requestLinks.github_auth_url,
        {
          height: popupHeight,
          width: popupWidth,
          top: top,
          left: left
        }
      )

      const result = await popup.wait()
      const res = await api.getAuthorized('github', result.code, result.state)
      if (isSuccessRes(res)) {
        const identity = await githubHandleToIdentity(result.id_token);
        //authStore.signin(result.code, 'github', res.id_token, res.session_id, identity)
        authStore.signin(res as OAuthRes)
        return true
      } else {
        authStore.setError(parseErrorMessage(res))
        return false
      }
    } catch (e) {
      authStore.setError((e! as Error).message)
      return false
    }
  }, [])

  const signinSIE = useCallback(async () => {
    try {
      const requestLinks = await api.getRequestLink()

      const popupHeight = '600px'
      const popupWidth = '440px'
      const top = '0px'
      const left = '0px'

      const popup = OAuthPopup.open(
        'oauth2-authorize-popup',
        requestLinks.eth_auth_url,
        {
          height: popupHeight,
          width: popupWidth,
          top: top,
          left: left
        }
      )
      const result = await popup.wait()
      const res = await api.getAuthorized('eth', result.code, result.state)
      if (isSuccessRes(res)) {
        const identity = await ethAddressToIdentity(res.id_token)
        //authStore.signin(result.code, 'eth', res.id_token, res.session_id, identity)
        authStore.signin(res as OAuthRes)
        return true
      } else {
        authStore.setError(parseErrorMessage(res))
        return false
      }
    } catch (e) {
      authStore.setError((e! as Error).message)
      return false
    }
  }, [])

  return {
    signinGithub,
    signinSIE
  }
}
