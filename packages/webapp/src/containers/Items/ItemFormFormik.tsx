import { Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
// @ts-nocheck
import React from 'react';
import intl from 'react-intl-universal';

import '@bigcapital/webapp/style/pages/Items/Form.scss';

import { AppToaster } from '@bigcapital/webapp/components';
import { CLASSES } from '@bigcapital/webapp/constants/classes';
import ItemFormBody from './ItemFormBody';
import ItemFormFloatingActions from './ItemFormFloatingActions';
import ItemFormInventorySection from './ItemFormInventorySection';
import ItemFormPrimarySection from './ItemFormPrimarySection';

import { safeInvoke } from '@bigcapital/webapp/utils';
import { CreateItemFormSchema, EditItemFormSchema } from './ItemForm.schema';
import { useItemFormContext } from './ItemFormProvider';
import { transformSubmitRequestErrors, useItemFormInitialValues } from './utils';

/**
 * Item form.
 */
export default function ItemFormFormik({
  // #ownProps
  initialValues: initialValuesComponent,
  onSubmitSuccess,
  onSubmitError,
  onCancel,
  className,
}) {
  // Item form context.
  const { itemId, item, accounts, createItemMutate, editItemMutate, submitPayload, isNewMode } = useItemFormContext();

  // Initial values in create and edit mode.
  const initialValues = useItemFormInitialValues(item, initialValuesComponent);

  // Handles the form submit.
  const handleFormSubmit = (values, form) => {
    const { setSubmitting, resetForm, setErrors } = form;
    const formValues = { ...values };

    setSubmitting(true);

    // Handle response succes.
    const onSuccess = (response) => {
      AppToaster.show({
        message: intl.get(
          isNewMode ? 'the_item_has_been_created_successfully' : 'the_item_has_been_edited_successfully',
          {
            number: itemId,
          },
        ),
        intent: Intent.SUCCESS,
      });
      resetForm();
      setSubmitting(false);

      safeInvoke(onSubmitSuccess, values, form, submitPayload, response);
    };
    // Handle response error.
    const onError = (errors) => {
      setSubmitting(false);

      if (errors) {
        const _errors = transformSubmitRequestErrors(errors);
        setErrors({ ..._errors });
      }
      safeInvoke(onSubmitError, values, form, submitPayload, errors);
    };
    if (isNewMode) {
      createItemMutate(formValues).then(onSuccess).catch(onError);
    } else {
      editItemMutate([itemId, formValues]).then(onSuccess).catch(onError);
    }
  };

  return (
    <div className={classNames(CLASSES.PAGE_FORM, CLASSES.PAGE_FORM_ITEM, className)}>
      <Formik
        enableReinitialize={true}
        validationSchema={isNewMode ? CreateItemFormSchema : EditItemFormSchema}
        initialValues={initialValues}
        onSubmit={handleFormSubmit}
      >
        <Form>
          <div className={classNames(CLASSES.PAGE_FORM_BODY)}>
            <ItemFormPrimarySection />
            <ItemFormBody accounts={accounts} />
            <ItemFormInventorySection accounts={accounts} />
          </div>

          <ItemFormFloatingActions onCancel={onCancel} />
        </Form>
      </Formik>
    </div>
  );
}
