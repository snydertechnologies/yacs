import { DashboardInsider } from '@bigcapital/webapp/components';
import { ImportView } from '@bigcapital/webapp/containers/Import';
// @ts-nocheck
import { useHistory } from 'react-router-dom';

export default function PaymentMadesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/payment-mades');
  };
  const handleImportSuccess = () => {
    history.push('/payment-mades');
  };

  return (
    <DashboardInsider name={'import-payment-mades'}>
      <ImportView
        resource={'bill_payment'}
        onCancelClick={handleCancelBtnClick}
        onImportSuccess={handleImportSuccess}
      />
    </DashboardInsider>
  );
}
