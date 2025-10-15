import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router";

// Assume these icons are imported from an icon library
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  PlugInIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons";
import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path?: string; pro?: boolean; new?: boolean; subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[] }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <UserCircleIcon />,
    name: "Voice",
    subItems: [
      { 
        name: "PBX", 
        subItems: [
          { name: "Operator Panel", path: "/voice/pbx/operator-panel" },
          { name: "Extensions", path: "/voice/pbx/extensions" },
          { name: "Inbound Route", path: "/voice/pbx/inbound-route" },
          { name: "Outbound Route", path: "/voice/pbx/outbound-route" },
          { name: "Ring Group", path: "/voice/pbx/ring-group" },
          { name: "Closed User Group", path: "/voice/pbx/closed-user-group" },
          { name: "Approved Trunks", path: "/voice/pbx/approved-trunks" }
        ]
      },
      { name: "Caller IDs", path: "/voice/caller-ids" },
      { name: "Sound Files", path: "/voice/sound-files" },
      { name: "Text To Speech", path: "/voice/text-to-speech" },
      { name: "Quick Call", path: "/voice/quick-call" },
      { name: "Call Flow", path: "/voice/call-flow" }
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Click to Connect",
    path: "/click-to-connect",
  },
  {
    icon: <PieChartIcon />,
    name: "Hot Scan",
    path: "/hot-scan",
  },
  {
    icon: <PieChartIcon />,
    name: "Reports",
    subItems: [
      { name: "Call Reports", path: "/reports/call-reports" },
      { name: "Transaction History", path: "/reports/transaction-history" },
      { name: "Deleted Extension Logs", path: "/reports/deleted-extension-logs" }
    ],
  },
  {
    icon: <ListIcon />,
    name: "Tickets",
    path: "/tickets",
  },
  {
    icon: <UserCircleIcon />,
    name: "Get Softphone",
    path: "/softphone",
  },
  {
    name: "User Management",
    icon: <UserCircleIcon />,
    subItems: [
      { name: "User List", path: "/user-management/user-list" },
      { name: "Add User", path: "/user-management/add-user" },
      { name: "Login Deactivate", path: "/user-management/login-deactivate" }
    ],
  },
  {
    name: "Settings",
    icon: <BoxCubeIcon />,
    subItems: [
      { name: "Global Setting", path: "/settings/global-setting" },
      { name: "Role Permission", path: "/settings/role-permission" },
      { name: "Packages", path: "/settings/packages" },
      { name: "Products", path: "/settings/products" },
      { name: "Database Backup", path: "/settings/database-backup" }
    ],
  },
  {
    name: "Forms",
    icon: <ListIcon />,
    subItems: [{ name: "Form Elements", path: "/form-elements", pro: false }],
  },
  {
    name: "Tables",
    icon: <TableIcon />,
    subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
  },
  {
    name: "Pages",
    icon: <PageIcon />,
    subItems: [
      { name: "Blank Page", path: "/blank", pro: false },
      { name: "404 Error", path: "/error-404", pro: false },
    ],
  },
];

const othersItems: NavItem[] = [
  {
    icon: <PieChartIcon />,
    name: "Charts",
    subItems: [
      { name: "Line Chart", path: "/line-chart", pro: false },
      { name: "Bar Chart", path: "/bar-chart", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "UI Elements",
    subItems: [
      { name: "Alerts", path: "/alerts", pro: false },
      { name: "Avatar", path: "/avatars", pro: false },
      { name: "Badge", path: "/badge", pro: false },
      { name: "Buttons", path: "/buttons", pro: false },
      { name: "Images", path: "/images", pro: false },
      { name: "Videos", path: "/videos", pro: false },
    ],
  },
  {
    icon: <PlugInIcon />,
    name: "Authentication",
    subItems: [
      { name: "Sign In", path: "/signin", pro: false },
      { name: "Sign Up", path: "/signup", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [openNestedSubmenu, setOpenNestedSubmenu] = useState<{
    type: "main" | "others";
    menuIndex: number;
    subIndex: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const [nestedSubMenuHeight, setNestedSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback(
    (path: string) => {
      if (path === '/user-management/user-list') {
        return location.pathname === path || location.pathname.startsWith('/user-management/edit-user/');
      }
      if (path === '/voice/caller-ids') {
        return location.pathname === path || location.pathname.startsWith('/voice/caller-ids/');
      }
      if (path === '/voice/sound-files') {
        return location.pathname === path || location.pathname.startsWith('/voice/sound-files/');
      }
      if (path === '/voice/text-to-speech') {
        return location.pathname === path || location.pathname.startsWith('/voice/text-to-speech/');
      }
      if (path === '/voice/quick-call') {
        return location.pathname === path || location.pathname.startsWith('/voice/quick-call/');
      }
      return location.pathname === path;
    },
    [location.pathname]
  );

  useEffect(() => {
    let submenuMatched = false;
    let nestedSubmenuMatched = false;
    
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, menuIndex) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem, subIndex) => {
            if (subItem.path && isActive(subItem.path)) {
              setOpenSubmenu({
                type: menuType as "main" | "others",
                index: menuIndex,
              });
              submenuMatched = true;
            }
            
            if (subItem.subItems) {
              subItem.subItems.forEach((nestedItem) => {
                if (nestedItem.path && isActive(nestedItem.path)) {
                  setOpenSubmenu({
                    type: menuType as "main" | "others",
                    index: menuIndex,
                  });
                  setOpenNestedSubmenu({
                    type: menuType as "main" | "others",
                    menuIndex,
                    subIndex,
                  });
                  submenuMatched = true;
                  nestedSubmenuMatched = true;
                }
              });
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
    if (!nestedSubmenuMatched) {
      setOpenNestedSubmenu(null);
    }
  }, [location, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  useEffect(() => {
    if (openNestedSubmenu !== null) {
      const key = `${openNestedSubmenu.type}-${openNestedSubmenu.menuIndex}-${openNestedSubmenu.subIndex}`;
      if (subMenuRefs.current[key]) {
        setNestedSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openNestedSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  const handleNestedSubmenuToggle = (menuIndex: number, subIndex: number, menuType: "main" | "others") => {
    setOpenNestedSubmenu((prevOpenNestedSubmenu) => {
      if (
        prevOpenNestedSubmenu &&
        prevOpenNestedSubmenu.type === menuType &&
        prevOpenNestedSubmenu.menuIndex === menuIndex &&
        prevOpenNestedSubmenu.subIndex === subIndex
      ) {
        return null;
      }
      return { type: menuType, menuIndex, subIndex };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "menu-item-active"
                  : "menu-item-inactive"
              } cursor-pointer ${
                !isExpanded && !isHovered
                  ? "lg:justify-center"
                  : "lg:justify-start"
              }`}
            >
              <span
                className={`menu-item-icon-size  ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.type === menuType &&
                    openSubmenu?.index === index
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`menu-item-icon-size ${
                    isActive(nav.path)
                      ? "menu-item-icon-active"
                      : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem, subIndex) => (
                  <li key={subItem.name}>
                    {subItem.subItems ? (
                      <div>
                        <button
                          onClick={() => handleNestedSubmenuToggle(index, subIndex, menuType)}
                          className={`menu-dropdown-item menu-dropdown-item-inactive font-medium w-full text-left flex items-center justify-between ${
                            openNestedSubmenu?.type === menuType &&
                            openNestedSubmenu?.menuIndex === index &&
                            openNestedSubmenu?.subIndex === subIndex
                              ? "menu-dropdown-item-active"
                              : "menu-dropdown-item-inactive"
                          }`}
                        >
                          {subItem.name}
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform duration-200 ${
                              openNestedSubmenu?.type === menuType &&
                              openNestedSubmenu?.menuIndex === index &&
                              openNestedSubmenu?.subIndex === subIndex
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                        <div
                          ref={(el) => {
                            subMenuRefs.current[`${menuType}-${index}-${subIndex}`] = el;
                          }}
                          className="overflow-hidden transition-all duration-300"
                          style={{
                            height:
                              openNestedSubmenu?.type === menuType &&
                              openNestedSubmenu?.menuIndex === index &&
                              openNestedSubmenu?.subIndex === subIndex
                                ? `${nestedSubMenuHeight[`${menuType}-${index}-${subIndex}`]}px`
                                : "0px",
                          }}
                        >
                          <ul className="mt-1 space-y-1 ml-4">
                            {subItem.subItems.map((nestedItem) => (
                              <li key={nestedItem.name}>
                                <Link
                                  to={nestedItem.path}
                                  className={`menu-dropdown-item text-sm ${
                                    isActive(nestedItem.path)
                                      ? "menu-dropdown-item-active"
                                      : "menu-dropdown-item-inactive"
                                  }`}
                                >
                                  {nestedItem.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={subItem.path!}
                        className={`menu-dropdown-item ${
                          isActive(subItem.path!)
                            ? "menu-dropdown-item-active"
                            : "menu-dropdown-item-inactive"
                        }`}
                      >
                        {subItem.name}
                        <span className="flex items-center gap-1 ml-auto">
                          {subItem.new && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path!)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              new
                            </span>
                          )}
                          {subItem.pro && (
                            <span
                              className={`ml-auto ${
                                isActive(subItem.path!)
                                  ? "menu-dropdown-badge-active"
                                  : "menu-dropdown-badge-inactive"
                              } menu-dropdown-badge`}
                            >
                              pro
                            </span>
                          )}
                        </span>
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${
          isExpanded || isMobileOpen
            ? "w-[290px]"
            : isHovered
            ? "w-[290px]"
            : "w-[90px]"
        }
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${
          !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
        }`}
      >
        <Link to="/">
          <img
            src="https://connect.sohub.com.bd/uploads/app_image/sohub-connect-logo.png"
            alt="SoHub Connect"
            className={`${
              isExpanded || isHovered || isMobileOpen
                ? "w-[150px] h-[40px]"
                : "w-[32px] h-[32px]"
            } object-contain`}
          />
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Menu"
                ) : (
                  <HorizontaLDots className="size-6" />
                )}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>
            <div className="">
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center"
                    : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? (
                  "Others"
                ) : (
                  <HorizontaLDots />
                )}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
        {isExpanded || isHovered || isMobileOpen ? <SidebarWidget /> : null}
      </div>
    </aside>
  );
};

export default AppSidebar;
