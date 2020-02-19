import React, { Fragment } from 'react';
import ReactNofitication from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
import { useConfirm } from 'material-ui-confirm';

import LayoutContainer from 'components/Layout';
import Dashboard from 'containers/Dashboard';
import CompareDialog from 'containers/CompareDialog';
import hoc from './hoc';

export const WrapperContainer = ({
  history,
  dashboardReducer,
  dashboardList,
  fieldsList,
  isContactMap,
  stashesList,
  updateDashboard,
  stashData,
  updateFields,
  revertCTA,
  submitCTA,
  submitOne,
  revertOne,
  ...props
}) => {

  const [isCompareModalShown, setIsCompareModalShown] = React.useState(false);
  const confirm = useConfirm();

  const compareStore = () => {
    setIsCompareModalShown(true);
  }

  const handleRevertAll = () => {
    confirm({ description: 'All changes will be reverted!' })
      .then(() => {
        revertCTA();
      });
  };

  const handleSubmitAll = () => {
    confirm({ description: 'All changes will be submitted!' })
      .then(() => {
        submitCTA();
      });
  };

  return (
    <Fragment>
      <ReactNofitication />
      <LayoutContainer
        history={history}
        revertCTA={handleRevertAll}
        submitCTA={handleSubmitAll}
        compareCTA={compareStore}
      />
      <Dashboard
        dashboardReducer={dashboardReducer}
        dashboardList={dashboardList}
        fieldsList={fieldsList}
        isContactMap={isContactMap}
        updateDashboard={updateDashboard}
        stashData={stashData}
        updateFields={updateFields}
        { ...props }
      />
      <CompareDialog
        isModalShown={isCompareModalShown}
        stashesList={stashesList}
        hideModal={() => setIsCompareModalShown(false)}
        submitCTA={handleSubmitAll}
        submitOne={submitOne}
        revertOne={revertOne}
      />
    </Fragment>
  )
}

export default hoc(WrapperContainer);