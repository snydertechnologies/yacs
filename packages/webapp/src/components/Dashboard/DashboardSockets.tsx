import { AppToaster } from '@bigcapital/webapp/components';
import t from '@bigcapital/webapp/hooks/query/types';
import { Intent } from '@blueprintjs/core';
import { useEffect, useRef } from 'react';
import { useQueryClient } from 'react-query';
import { io } from 'socket.io-client';

export function DashboardSockets() {
  const socket = useRef<any>();
  const client = useQueryClient();

  useEffect(() => {
    socket.current = io('/', { path: '/socket' });

    socket.current.on('NEW_TRANSACTIONS_DATA', () => {
      client.invalidateQueries(t.ACCOUNTS);
      client.invalidateQueries(t.ACCOUNT_TRANSACTION);
      client.invalidateQueries(t.CASH_FLOW_ACCOUNTS);
      client.invalidateQueries(t.CASH_FLOW_TRANSACTIONS);

      AppToaster.show({
        message: 'The Plaid connected accounts have been updated.',
        intent: Intent.SUCCESS,
      });
    });
    return () => {
      socket.current.removeAllListeners();
      socket.current.close();
    };
  }, []);
}
