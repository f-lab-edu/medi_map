import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { CustomButton } from "./CustomButton";
import '@/styles/common/tailwind.css';
import '@/styles/common/common.scss';

export default {
  title: "Components/CustomButton",
  component: CustomButton,
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["background", "border"],
    },
    type: {
      control: { type: "radio" },
      options: ["button", "submit", "reset"],
    },
    onClick: { action: "clicked" }, 
    children: { control: "text" }, 
    className: { control: "text" }, 
  },
} as Meta<typeof CustomButton>;

const Template: StoryFn<typeof CustomButton> = (args) => (
  <CustomButton {...args} />
);

export const BackgroundButton = Template.bind({});
BackgroundButton.args = {
  variant: "background",
  children: "배경 버튼",
};

export const BorderButton = Template.bind({});
BorderButton.args = {
  variant: "border",
  children: "테두리 버튼",
};
