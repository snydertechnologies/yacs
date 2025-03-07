// @ts-nocheck
import { DashboardInsider } from '@bigcapital/webapp/components';
import { ImportView } from '@bigcapital/webapp/containers/Import';
import { useHistory } from 'react-router-dom';

export default function CreditNotesImport() {
  const history = useHistory();

  const handleCancelBtnClick = () => {
    history.push('/credit-notes');
  };
  const handleImportSuccess = () => {
    history.push('/credit-notes');
  };

  return (
    <DashboardInsider name={'import-credit-notes'}>
      <ImportView resource={'credit_note'} onCancelClick={handleCancelBtnClick} onImportSuccess={handleImportSuccess} />
    </DashboardInsider>
  );
}
