import { Button, Descriptions } from "antd";
import { CurrUser } from "../script/type";

interface DetailProps {
  info: CurrUser | undefined;
  switchToPage: (id: number, page:number) => Promise<void>;
}

export default function Detail(props: DetailProps) {
  return (
    <Descriptions
      title={
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>User Info</h1>
          <Button
            color="orange"
            variant="outlined"
            onClick={async () => {
              if (props.info) props.switchToPage(props.info?.id, 2);
            }}
          >
            Check Messages
          </Button>
        </div>
      }
      bordered
      column={2}
      style={{
        backgroundColor: "#f9f9f9",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Descriptions.Item label="Username" span={2}>
        {props.info?.username}
      </Descriptions.Item>
      <Descriptions.Item label="Email" span={2}>
        {props.info?.email}
      </Descriptions.Item>
      <Descriptions.Item label="Created At" span={2}>
        {new Date(props.info?.createdAt || "").toLocaleString()}
      </Descriptions.Item>

      <Descriptions.Item label="Role">
        {props.info?.role ? "Admin" : "User"}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        {props.info?.isActive ? "Normal" : "Banned"}
      </Descriptions.Item>
    </Descriptions>
  );
}
