import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import { ROLES } from "./lib/roles";
import { detectBasename } from "./lib/basename";
import { RoleShell } from "./components/RoleShell";
import { SignIn } from "./routes/SignIn";

import { ManagerOverview } from "./routes/manager/Overview";
import { ManagerTriage } from "./routes/manager/Triage";
import { ManagerApprovals } from "./routes/manager/Approvals";
import { ManagerActive } from "./routes/manager/Active";
import { ManagerHistory } from "./routes/manager/History";
import { ManagerProperties } from "./routes/manager/Properties";
import { ManagerVendors } from "./routes/manager/Vendors";
import { ManagerLandlords } from "./routes/manager/Landlords";
import { ManagerReports } from "./routes/manager/Reports";

import { TenantHome } from "./routes/tenant/Home";
import { TenantReport } from "./routes/tenant/Report";
import { TenantMyIssues } from "./routes/tenant/MyIssues";
import { TenantNotifications } from "./routes/tenant/Notifications";
import { TenantTenancy } from "./routes/tenant/Tenancy";

import { LandlordOverview } from "./routes/landlord/Overview";
import { LandlordApprovals } from "./routes/landlord/Approvals";
import { LandlordPortfolio } from "./routes/landlord/Portfolio";
import { LandlordDocuments } from "./routes/landlord/Documents";
import { LandlordFinancials } from "./routes/landlord/Financials";

import { VendorOverview } from "./routes/vendor/Overview";
import { VendorQueue } from "./routes/vendor/Queue";
import { VendorHistory } from "./routes/vendor/History";
import { VendorEarnings } from "./routes/vendor/Earnings";
import { VendorProfile } from "./routes/vendor/Profile";

export default function App() {
  const manager = ROLES.find((r) => r.key === "manager")!;
  const tenant = ROLES.find((r) => r.key === "tenant")!;
  const landlord = ROLES.find((r) => r.key === "landlord")!;
  const vendor = ROLES.find((r) => r.key === "vendor")!;

  return (
    <StoreProvider>
      <BrowserRouter basename={detectBasename()}>
        <Routes>
          <Route path="/" element={<SignIn />} />

          <Route path="/manager" element={<RoleShell role={manager} />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<ManagerOverview />} />
            <Route path="triage" element={<ManagerTriage />} />
            <Route path="approvals" element={<ManagerApprovals />} />
            <Route path="active" element={<ManagerActive />} />
            <Route path="history" element={<ManagerHistory />} />
            <Route path="properties" element={<ManagerProperties />} />
            <Route path="vendors" element={<ManagerVendors />} />
            <Route path="landlords" element={<ManagerLandlords />} />
            <Route path="reports" element={<ManagerReports />} />
          </Route>

          <Route path="/tenant" element={<RoleShell role={tenant} />}>
            <Route index element={<Navigate to="home" replace />} />
            <Route path="home" element={<TenantHome />} />
            <Route path="report" element={<TenantReport />} />
            <Route path="issues" element={<TenantMyIssues />} />
            <Route path="notifications" element={<TenantNotifications />} />
            <Route path="tenancy" element={<TenantTenancy />} />
          </Route>

          <Route path="/landlord" element={<RoleShell role={landlord} />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<LandlordOverview />} />
            <Route path="approvals" element={<LandlordApprovals />} />
            <Route path="portfolio" element={<LandlordPortfolio />} />
            <Route path="documents" element={<LandlordDocuments />} />
            <Route path="financials" element={<LandlordFinancials />} />
          </Route>

          <Route path="/vendor" element={<RoleShell role={vendor} />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<VendorOverview />} />
            <Route path="queue" element={<VendorQueue />} />
            <Route path="history" element={<VendorHistory />} />
            <Route path="earnings" element={<VendorEarnings />} />
            <Route path="profile" element={<VendorProfile />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
