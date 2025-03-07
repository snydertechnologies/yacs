import {
  setEmailConfirmed,
  setLogin,
} from '@bigcapital/webapp/store/authentication/authentication.actions';
import { isAuthenticated } from '@bigcapital/webapp/store/authentication/authentication.reducer';
import { removeCookie } from '@bigcapital/webapp/utils';
import { useCallback } from 'react';
import { useQueryClient } from 'react-query';
// @ts-nocheck
import { useDispatch, useSelector } from 'react-redux';

/**
 * Removes the authentication cookies.
 */
function removeAuthenticationCookies() {
  removeCookie('token');
  removeCookie('organization_id');
  removeCookie('tenant_id');
  removeCookie('authenticated_user_id');
  removeCookie('locale');
}

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  return {
    setLogin: useCallback((login) => dispatch(setLogin(login)), [dispatch]),
    setLogout: useCallback(() => {
      // Resets store state.
      // dispatch(setStoreReset());

      // Remove all cached queries.
      queryClient.removeQueries();

      removeAuthenticationCookies();

      window.location.reload();
    }, [queryClient]),
  };
};

/**
 * Retrieve whether the user is authenticated.
 */
export const useIsAuthenticated = () => {
  return useSelector(isAuthenticated);
};

/**
 * Retrieve the authentication token.
 */
export const useAuthToken = () => {
  return useSelector((state) => state.authentication.token);
};

/**
 * Retrieve the authentication user.
 */
export const useAuthUser = () => {
  return useSelector((state) => ({}));
};

/**
 * Retrieve the authenticated organization id.
 */
export const useAuthOrganizationId = () => {
  return useSelector((state) => state.authentication.organizationId);
};

/**
 * Retrieves the user's email verification status.
 */
export const useAuthUserVerified = () => {
  return useSelector((state) => state.authentication.verified);
};

/**
 * Sets the user's email verification status.
 */
export const useSetAuthEmailConfirmed = () => {
  const dispatch = useDispatch();

  return useCallback(
    (verified?: boolean = true) => dispatch(setEmailConfirmed(verified)),
    [dispatch],
  );
};
