// @ts-nocheck
import { Formik } from 'formik';
import { Link } from 'react-router-dom';

import { FormattedMessage as T, AppToaster as Toaster } from '@bigcapital/webapp/components';
import AuthInsider from '@bigcapital/webapp/containers/Authentication/AuthInsider';
import { useAuthLogin } from '@bigcapital/webapp/hooks/query';

import { useAuthMetaBoot } from './AuthMetaBoot';
import LoginForm from './LoginForm';
import { AuthFooterLink, AuthFooterLinks, AuthInsiderCard } from './_components';
import { LoginSchema, transformLoginErrorsToToasts } from './utils';

const initialValues = {
  crediential: '',
  password: '',
  keepLoggedIn: false,
};

/**
 * Login page.
 */
export default function Login() {
  const { mutateAsync: loginMutate } = useAuthLogin();

  const handleSubmit = (values, { setSubmitting }) => {
    loginMutate({
      crediential: values.crediential,
      password: values.password,
    }).catch(
      ({
        response: {
          data: { errors },
        },
      }) => {
        const toastBuilders = transformLoginErrorsToToasts(errors);

        toastBuilders.forEach((builder) => {
          Toaster.show(builder);
        });
        setSubmitting(false);
      },
    );
  };

  return (
    <AuthInsider>
      <AuthInsiderCard>
        <Formik
          initialValues={initialValues}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
          component={LoginForm}
        />
      </AuthInsiderCard>

      <LoginFooterLinks />
    </AuthInsider>
  );
}

function LoginFooterLinks() {
  const { signupDisabled } = useAuthMetaBoot();

  return (
    <AuthFooterLinks>
      {!signupDisabled && (
        <AuthFooterLink>
          <T id={'dont_have_an_account'} />{' '}
          <Link to={'/auth/register'}>
            <T id={'sign_up'} />
          </Link>
        </AuthFooterLink>
      )}
      <AuthFooterLink>
        <Link to={'/auth/send_reset_password'}>
          <T id={'forget_my_password'} />
        </Link>
      </AuthFooterLink>
    </AuthFooterLinks>
  );
}
