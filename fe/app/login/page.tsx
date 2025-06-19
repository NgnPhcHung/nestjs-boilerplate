"use client";

import { useRouter } from "next/navigation";
import { Button, Flex, Form, Input } from "antd";
import { userLogin } from "@/graphql/mutations/auth";

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = async (e: any) => {
    try {
      const result = await userLogin(e);
      if (result?.success) {
        alert("hehe");
        console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
        router.push("/");
      }
    } catch (err) {
      console.log("Login failed");
    }
  };

  return (
    <Flex gap="middle" vertical align="center" justify="center">
      <Form onFinish={handleSubmit}>
        <Form.Item label="Username" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="password">
          <Input.Password />
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Login
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
}
