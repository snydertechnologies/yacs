// @ts-nocheck
import ApiService from '@bigcapital/webapp/services/ApiService';
import t from '@bigcapital/webapp/store/types';

export const fetchResourceFields = ({ resourceSlug }) => {
  return (dispatch) =>
    new Promise((resolve, reject) => {
      ApiService.get(`fields/resource/${resourceSlug}`)
        .then((response) => {
          dispatch({
            type: t.CUSTOM_FIELDS_RESOURCE_SET,
            resourceSlug: resourceSlug,
            fields: response.data.fields,
          });
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
};
