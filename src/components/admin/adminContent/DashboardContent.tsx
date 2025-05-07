import React from 'react'
import SubscriptionOverview from '../report-components/SubscriptionOverview'
import RevenueTrendChart from '../report-components/RevenueTrendChart'
import PlanDistributionChart from '../report-components/PlanDistributionChart'
import SubscriptionReportDownload from '../report-components/SubscriptionReportDownload'

const DashboardContent = () => {
  return (
    <>
    <SubscriptionOverview/>
    <RevenueTrendChart/>
    <PlanDistributionChart/>
    <SubscriptionReportDownload/>
    </>
  )
}

export default DashboardContent