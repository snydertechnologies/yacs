import { DATATYPES_LENGTH } from '@bigcapital/webapp/constants/dataTypes';
import intl from 'react-intl-universal';
// @ts-nocheck
import * as Yup from 'yup';

const Schema = Yup.object().shape({
  role_name: Yup.string().required().label(intl.get('roles.label.role_name_')),
  role_description: Yup.string().nullable().max(DATATYPES_LENGTH.TEXT),
  permissions: Yup.object().shape({
    subject: Yup.string(),
    ability: Yup.string(),
    value: Yup.boolean(),
  }),
});

export const CreateRolesFormSchema = Schema;
export const EditRolesFormSchema = Schema;
