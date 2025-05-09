import { ConfigProvider } from "antd";
import { useState } from "react";
import { Layout, Menu } from "antd";
import { useEffect } from "react";
import { CurrUser, UserInList } from "../script/type";
import { getUsers, getUsersList, logout } from "../script/checkToken";
import Detail from "./Detail";
import UsersTable from "./UsersTable";
import MessagesBoard from "./MessagesBoard";

export default function Dashboard() {
  const [data, setData] = useState<UserInList[]>([]);
  const [isChange, setIsChange] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [currUser, setCurrUser] = useState<CurrUser>();
  const [selectedUser, setSelectedUser] = useState<CurrUser>();
  const { Content, Sider } = Layout;

  useEffect(() => {
    async function checkUser(): Promise<void> {
      const user_id = localStorage.getItem("user_id");
      if (!user_id) {
        logout();
        return;
      }

      const user = await getUsers(Number(user_id));

      if (!user || !user.role || !user.isActive) {
        logout();
        if (!user?.isActive) alert("you are banned");
        return;
      }

      setCurrUser({
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        role: user.role,
        isActive: user.isActive,
      });
    }

    checkUser();
    getUsersList().then((newData) => {
      Array.isArray(newData) ? setData(newData) : setData([]);
    });
  }, [isChange]);

  function contentSwitch() {
    switch (page) {
      case 0:
        return (
          <UsersTable
            setIsChange={setIsChange}
            switchToPage={switchToPage}
            order={order}
            data={data}
          />
        );
      case 1:
        return <Detail info={currUser} switchToPage={switchToPage} />;
      case 2:
        return (
          <MessagesBoard
            id={selectedUser?.id || Number(localStorage.getItem("user_id"))}
            setIsChange={setIsChange}
            username={selectedUser?.username || ""}
          />
        );
      default:
        return;
    }
  }

  async function switchToPage(id: number, page: number) {
    const user = await getUsers(id);

    if (user === undefined) return;
    if (page === 2) {
      setSelectedUser({
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        role: user.role,
        isActive: user.isActive,
      });
    } else {
      setCurrUser({
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        role: user.role,
        isActive: user.isActive,
      });
    }
    setPage(page);
  }

  const order = [
    {
      label: <span>Admin</span>,
      key: "admin",
    },
    {
      label: <span>User</span>,
      key: "user",
    },
  ];
  const sidebar = [
    {
      key: 0,
      label: "Home",
    },
    {
      key: 1,
      label: "User",
    },
    {
      key: 2,
      label: "Messages",
    },
    { key: 3, label: "Logout" },
  ];

  return (
    <section className="dashboard-section">
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              lightSiderBg: "#E3F8FF",
            },
          },
        }}
      >
        <Layout style={{ backgroundColor: "transparent" }}>
          <Sider
            theme="light"
            style={{ borderRadius: "8px 0 0 8px" }}
            width="20%"
          >
            <Menu
              mode="inline"
              selectedKeys={[String(page)]}
              items={sidebar}
              onClick={({ key }) => {
                if (key === "3") {
                  logout();
                } else if (key === "1") {
                  switchToPage(
                    Number(localStorage.getItem("user_id")),
                    Number(key)
                  );
                } else if (key === "0") {
                  setPage(Number(key));
                } else if (key === "2") {
                  switchToPage(
                    Number(localStorage.getItem("user_id")),
                    Number(key)
                  );
                  setSelectedUser(currUser);
                }
              }}
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "20px",
                borderRadius: "8px 0 0 8px",
                padding: "0px 20px",
              }}
            />
          </Sider>
          <Content
            style={{
              backgroundColor: "#FFD3B6",
              borderRadius: "0 8px 8px 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {contentSwitch()}
          </Content>
        </Layout>
      </ConfigProvider>
    </section>
  );
}
