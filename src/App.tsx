import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router";
import { AuthProvider } from "./context/AuthContext";
import { SidebarProvider } from "./context/SidebarContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import FormElements from "./pages/Forms/FormElements";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import RoleBasedRedirect from "./components/RoleBasedRedirect";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import TicketList from "./pages/Tickets/TicketList";
import AddTicket from "./pages/Tickets/AddTicket";
import TicketDetail from "./pages/Tickets/TicketDetail";
import ClickToConnect from "./pages/ClickToConnect";
import HotScan from "./pages/HotScan";
import OperatorPanel from "./pages/Voice/PBX/OperatorPanel";
import Extensions from "./pages/Voice/PBX/Extensions";
import AddExtension from "./pages/Voice/PBX/AddExtension";
import EditExtension from "./pages/Voice/PBX/EditExtension";
import InboundRoute from "./pages/Voice/PBX/InboundRoute";
import AddInboundRoute from "./pages/Voice/PBX/AddInboundRoute";
import EditInboundRoute from "./pages/Voice/PBX/EditInboundRoute";
import AddOutboundRoute from "./pages/Voice/PBX/AddOutboundRoute";
import EditOutboundRoute from "./pages/Voice/PBX/EditOutboundRoute";
import OutboundRoute from "./pages/Voice/PBX/OutboundRoute";
import RingGroup from "./pages/Voice/PBX/RingGroup";
import AddRingGroup from "./pages/Voice/PBX/AddRingGroup";
import EditRingGroup from "./pages/Voice/PBX/EditRingGroup";
import ClosedUserGroup from "./pages/Voice/PBX/ClosedUserGroup";
import AddClosedUserGroup from "./pages/Voice/PBX/AddClosedUserGroup";
import EditClosedUserGroup from "./pages/Voice/PBX/EditClosedUserGroup";
import ApprovedTrunks from "./pages/Voice/PBX/ApprovedTrunks";
import AddApprovedTrunk from "./pages/Voice/PBX/AddApprovedTrunk";
import EditApprovedTrunk from "./pages/Voice/PBX/EditApprovedTrunk";
import CallerIDs from "./pages/Voice/CallerIDs";
import AddCallerID from "./pages/Voice/AddCallerID";
import EditCallerID from "./pages/Voice/EditCallerID";
import SoundFiles from "./pages/Voice/SoundFiles";
import AddSoundFile from "./pages/Voice/AddSoundFile";
import EditSoundFile from "./pages/Voice/EditSoundFile";
import TextToSpeech from "./pages/Voice/TextToSpeech";
import AddTextToSpeech from "./pages/Voice/AddTextToSpeech";
import EditTextToSpeech from "./pages/Voice/EditTextToSpeech";
import QuickCall from "./pages/Voice/QuickCall";
import AddQuickCall from "./pages/Voice/AddQuickCall";
import EditQuickCall from "./pages/Voice/EditQuickCall";
import CallFlow from "./pages/Voice/CallFlow";
import CallReports from "./pages/Reports/CallReports";
import TransactionHistory from "./pages/Reports/TransactionHistory";
import DeletedExtensionLogs from "./pages/Reports/DeletedExtensionLogs";
import UserList from "./pages/UserManagement/UserList";
import AddUser from "./pages/UserManagement/AddUser";
import EditUser from "./pages/UserManagement/EditUser";
import LoginDeactivate from "./pages/UserManagement/LoginDeactivate";
import GlobalSetting from "./pages/Settings/GlobalSetting";
import RolePermission from "./pages/Settings/RolePermission";
import Packages from "./pages/Settings/Packages";
import Products from "./pages/Settings/Products";
import DatabaseBackup from "./pages/Settings/DatabaseBackup";
import Softphone from "./pages/Softphone";
import ForgotPassword from "./pages/AuthPages/ForgotPassword";
import Support from "./pages/Support";
import Notifications from "./pages/Notifications";

export default function App() {
  return (
    <ThemeProvider>
      <SidebarProvider>
        <AuthProvider>
          <Router>
        <ScrollToTop />
        <Routes>
          {/* Redirect root based on role */}
          <Route path="/" element={<RoleBasedRedirect />} />
          
          {/* Dashboard Layout - Protected */}
          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Home />} />

            {/* Tickets */}
            <Route path="tickets" element={<TicketList />} />
            <Route path="tickets/add" element={<AddTicket />} />
            <Route path="tickets/:id" element={<TicketDetail />} />

            {/* Coming Soon Pages */}
            <Route path="click-to-connect" element={<ClickToConnect />} />
            <Route path="hot-scan" element={<HotScan />} />
            <Route path="softphone" element={<Softphone />} />

            {/* Voice - PBX */}
            <Route path="voice/pbx/operator-panel" element={<OperatorPanel />} />
            <Route path="voice/pbx/extensions" element={<Extensions />} />
            <Route path="voice/pbx/extensions/add" element={<AddExtension />} />
            <Route path="voice/pbx/extensions/edit/:id" element={<EditExtension />} />
            <Route path="voice/pbx/inbound-route" element={<InboundRoute />} />
            <Route path="voice/pbx/inbound-route/add" element={<AddInboundRoute />} />
            <Route path="voice/pbx/inbound-route/edit/:id" element={<EditInboundRoute />} />
            <Route path="voice/pbx/outbound-route" element={<OutboundRoute />} />
            <Route path="voice/pbx/outbound-route/add" element={<AddOutboundRoute />} />
            <Route path="voice/pbx/outbound-route/edit/:id" element={<EditOutboundRoute />} />
            <Route path="voice/pbx/ring-group" element={<RingGroup />} />
            <Route path="voice/pbx/ring-group/add" element={<AddRingGroup />} />
            <Route path="voice/pbx/ring-group/edit/:id" element={<EditRingGroup />} />
            <Route path="voice/pbx/closed-user-group" element={<ClosedUserGroup />} />
            <Route path="voice/pbx/closed-user-group/add" element={<AddClosedUserGroup />} />
            <Route path="voice/pbx/closed-user-group/edit/:id" element={<EditClosedUserGroup />} />
            <Route path="voice/pbx/approved-trunks" element={<ApprovedTrunks />} />
            <Route path="voice/pbx/approved-trunks/add" element={<AddApprovedTrunk />} />
            <Route path="voice/pbx/approved-trunks/edit/:id" element={<EditApprovedTrunk />} />

            {/* Voice - Other */}
            <Route path="voice/caller-ids" element={<CallerIDs />} />
            <Route path="voice/caller-ids/add" element={<AddCallerID />} />
            <Route path="voice/caller-ids/edit/:id" element={<EditCallerID />} />
            <Route path="voice/sound-files" element={<SoundFiles />} />
            <Route path="voice/sound-files/add" element={<AddSoundFile />} />
            <Route path="voice/sound-files/edit/:id" element={<EditSoundFile />} />
            <Route path="voice/text-to-speech" element={<TextToSpeech />} />
            <Route path="voice/text-to-speech/add" element={<AddTextToSpeech />} />
            <Route path="voice/text-to-speech/edit/:id" element={<EditTextToSpeech />} />
            <Route path="voice/quick-call" element={<QuickCall />} />
            <Route path="voice/quick-call/add" element={<AddQuickCall />} />
            <Route path="voice/quick-call/edit/:id" element={<EditQuickCall />} />
            <Route path="voice/call-flow" element={<CallFlow />} />

            {/* Reports */}
            <Route path="reports/call-reports" element={<CallReports />} />
            <Route path="reports/transaction-history" element={<TransactionHistory />} />
            <Route path="reports/deleted-extension-logs" element={<DeletedExtensionLogs />} />

            {/* User Management */}
            <Route path="user-management/user-list" element={<UserList />} />
            <Route path="user-management/add-user" element={<AddUser />} />
            <Route path="user-management/edit-user/:id" element={<EditUser />} />
            <Route path="user-management/login-deactivate" element={<LoginDeactivate />} />

            {/* Settings */}
            <Route path="settings/global-setting" element={<GlobalSetting />} />
            <Route path="settings/role-permission" element={<RolePermission />} />
            <Route path="settings/packages" element={<Packages />} />
            <Route path="settings/products" element={<Products />} />
            <Route path="settings/database-backup" element={<DatabaseBackup />} />

            {/* Others Page */}
            <Route path="profile" element={<UserProfiles />} />
            <Route path="support" element={<Support />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="blank" element={<Blank />} />

            {/* Forms */}
            <Route path="form-elements" element={<FormElements />} />

            {/* Tables */}
            <Route path="basic-tables" element={<BasicTables />} />

            {/* Ui Elements */}
            <Route path="alerts" element={<Alerts />} />
            <Route path="avatars" element={<Avatars />} />
            <Route path="badge" element={<Badges />} />
            <Route path="buttons" element={<Buttons />} />
            <Route path="images" element={<Images />} />
            <Route path="videos" element={<Videos />} />

            {/* Charts */}
            <Route path="line-chart" element={<LineChart />} />
            <Route path="bar-chart" element={<BarChart />} />
          </Route>

          {/* Auth Layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
          </Routes>
          </Router>
        </AuthProvider>
      </SidebarProvider>
    </ThemeProvider>
  );
}
