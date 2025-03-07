import { FormattedMessage as T } from '@bigcapital/webapp/components';
// @ts-nocheck
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import intl from 'react-intl-universal';

import { CLASSES } from '@bigcapital/webapp/constants/classes';
import { Button, MenuItem } from '@blueprintjs/core';
import { Select } from '@blueprintjs/select';
import classNames from 'classnames';

import { handleContactRenderer, itemPredicate } from './utils';

export function ContactSelectField({
  contacts,
  initialContactId,
  selectedContactId,
  defaultSelectText = <T id={'select_contact'} />,
  onContactSelected,
  popoverFill = false,
  disabled = false,
  buttonProps,

  ...restProps
}) {
  const localContacts = useMemo(
    () =>
      contacts.map((contact) => ({
        ...contact,
        _id: `${contact.id}_${contact.contact_type}`,
      })),
    [contacts],
  );

  const initialContact = useMemo(() => contacts.find((a) => a.id === initialContactId), [initialContactId, contacts]);

  const [selecetedContact, setSelectedContact] = useState(initialContact || null);

  useEffect(() => {
    if (typeof selectedContactId !== 'undefined') {
      const account = selectedContactId ? contacts.find((a) => a.id === selectedContactId) : null;
      setSelectedContact(account);
    }
  }, [selectedContactId, contacts, setSelectedContact]);

  const handleContactSelect = useCallback(
    (contact) => {
      setSelectedContact({ ...contact });
      onContactSelected && onContactSelected(contact);
    },
    [setSelectedContact, onContactSelected],
  );

  return (
    <Select
      items={localContacts}
      noResults={<MenuItem disabled={true} text={<T id={'no_results'} />} />}
      itemRenderer={handleContactRenderer}
      itemPredicate={itemPredicate}
      filterable={true}
      disabled={disabled}
      onItemSelect={handleContactSelect}
      popoverProps={{ minimal: true, usePortal: !popoverFill }}
      className={classNames(CLASSES.FORM_GROUP_LIST_SELECT, {
        [CLASSES.SELECT_LIST_FILL_POPOVER]: popoverFill,
      })}
      inputProps={{
        placeholder: intl.get('filter_'),
      }}
      {...restProps}
    >
      <Button
        disabled={disabled}
        text={selecetedContact ? selecetedContact.display_name : defaultSelectText}
        {...buttonProps}
      />
    </Select>
  );
}
