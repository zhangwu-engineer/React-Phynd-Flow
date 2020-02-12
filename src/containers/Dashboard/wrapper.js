import React, { Fragment } from 'react';
import ReactNofitication from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';

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
    <Fragment>
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
    </Fragment>
  )
}

export default WrapperContainer;