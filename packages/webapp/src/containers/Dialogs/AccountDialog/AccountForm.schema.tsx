import { DATATYPES_LENGTH } from '@bigcapital/webapp/constants/dataTypes';
import intl from 'react-intl-universal';
// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  name: Yup.string().required().min(3).max(DATATYPES_LENGTH.STRING).label(intl.get('account_name_')),
  code: Yup.string().nullable().min(3).max(6),
  account_type: Yup.string().required().label(intl.get('account_type')),
  description: Yup.string().min(3).max(DATATYPES_LENGTH.TEXT).nullable().trim(),
  parent_account_id: Yup.number().nullable(),
});

export const CreateAccountFormSchema = Schema;
export const EditAccountFormSchema = Schema;
