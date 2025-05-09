import { Dropdown, Space, Table, ConfigProvider, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import { ReactNode } from "react";
import { changeRoleUser, deactivateUser } from "../script/checkToken";
import { UserInList } from "../script/type";

interface TableData {
  key: number;
  username: ReactNode;
  numMes: number;
  role: string;
  isActive: boolean;
  remove: ReactNode;
}

interface PropsData {
  data: UserInList[];
  setIsChange: React.Dispatch<React.SetStateAction<boolean>>;
  switchToPage: (id: number, page:number) => Promise<void>;
  order: {
    label: ReactNode;
    key: string;
  }[];
}

export default function UsersTable(props: PropsData) {
  const handleClick = (id: number) => async (e: { key: string }) => {
    await changeRoleUser(id, e.key === "admin" ? true : false);
    props.setIsChange((prev: boolean) => !prev);
  };
  const columns: ColumnsType<TableData> = [
    {
      title: "Username",
      dataIndex: "username",
      width: "40%",
      render: (text: string, record) => (
        <span onClick={() => props.switchToPage(record.key, 1)}>{text}</span>
      ),
    },
    {
      title: "No. messages",
      dataIndex: "numMes",
      width: "20%",
      sorter: (a, b) => a.numMes - b.numMes,
    },
    {
      title: "Role",
      dataIndex: "role",
      filters: [
        {
          text: "Admin",
          value: "Admin",
        },
        {
          text: "User",
          value: "User",
        },
      ],
      onFilter: (value, record) => record.role.startsWith(value as string),
      filterMultiple: false,
      render: (text, record) => (
        <Dropdown
          menu={{ items: props.order, onClick: handleClick(record.key) }}
          trigger={["click"]}
        >
          <span
            className="dropdown"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Space>
              <span className="capitalize">{text}</span>
            </Space>
          </span>
        </Dropdown>
      ),
      filterSearch: true,
      width: "20%",
    },
    {
      title: "Banned",
      dataIndex: "isActive",
      width: "10%",
      filters: [
        {
          text: "Banned",
          value: false,
        },
        {
          text: "Normal",
          value: true,
        },
      ],
      onFilter: (value, record) => record.isActive === value,
      render: (value) => (value ? "Normal" : "Banned"),
      filterMultiple: false,
    },
    {
      title: "Remove",
      dataIndex: "remove",
      width: "10%",
    },
  ];

  const processData: TableData[] = props.data.map((i: UserInList) => ({
    key: i.id,
    username: (
      <>
        <p>{i.username}</p>
        <p>{i.email}</p>
      </>
    ),
    numMes: i.messageCount,
    role: i.role ? "Admin" : "User",
    isActive: i.isActive,
    remove: (
      <Button
        variant="solid"
        color="volcano"
        style={{ width: "100%" }}
        onClick={async () => {
          await deactivateUser(i.id);
          props.setIsChange((prev: boolean) => !prev);
        }}
      >
        X
      </Button>
    ),
  }));

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            borderColor: "#000",
            bodySortBg: "#E3F8FF",
            headerSortHoverBg: "#E3F8FF",
            headerSortActiveBg: "#E3F8FF",
            headerBg: "#28CC9E",
            rowHoverBg: "#FFDD83",
            headerBorderRadius: 0,
          },
          Pagination: {
            margin: 0,
          },
        },
      }}
    >
      <Table<TableData>
        columns={columns}
        dataSource={processData}
        pagination={{ pageSize: 4 }}
        style={{ width: "80%" }}
      />
    </ConfigProvider>
  );
}
