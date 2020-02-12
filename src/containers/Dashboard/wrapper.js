import React from 'react';
import ReactNofitication from 'react-notifications-component';

import LayoutContainer from 'components/Layout';
import Dashboard from 'containers/Dashboard';
import CompareDialog from 'containers/CompareDialog';

const WrapperContainer = ({
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
  compareCTA,
  submitOne,
  revertOne,
}) => {

  const [isCompareModalShown, setIsCompareModalShown] = React.useState(false);

  return (
    <div>
      <ReactNofitication />
      <LayoutContainer
        history={history}
        revertCTA={revertCTA}
        submitCTA={submitCTA}
        compareCTA={compareCTA}
      />
      <Dashboard
        dashboardReducer={dashboardReducer}
        dashboardList={dashboardList}
        fieldsList={fieldsList}
        isContactMap={isContactMap}
        updateDashboard={updateDashboard}
        stashData={stashData}
        updateFields={updateFields}
      />
      <CompareDialog
        isModalShown={isCompareModalShown}
        stashesList={stashesList}
        hideModal={() => setIsCompareModalShown(false)}
        submitCTA={submitCTA}
        submitOne={submitOne}
        revertOne={revertOne}
      />
    </div>
  )
}

export default WrapperContainer;