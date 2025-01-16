import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CustomButton } from "./CustomButton";

export default {
  title: "Components/CustomButton",
  component: CustomButton,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["login", "social"],
    },
    children: { control: "text" },
  },
} as Meta<typeof CustomButton>;

const Template: StoryFn<typeof CustomButton> = (args) => (
  <CustomButton {...args} />
);

export const LoginButton = Template.bind({});
LoginButton.args = {
  variant: "login",
  children: "로그인",
};

export const SocialButton = Template.bind({});
SocialButton.args = {
  variant: "social",
  children: (
    <>
      <img src="/path/to/social-icon.png" alt="icon" className="w-6" />
      소셜 로그인
    </>
  ),
};