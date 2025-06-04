import React from "react";
export const CompanyIcon = ({ color = "#FFFFFF", opacity = 0.6, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.6667 8.16667C18.6667 10.744 16.5773 12.8333 14 12.8333C11.4227 12.8333 9.33334 10.744 9.33334 8.16667C9.33334 5.58934 11.4227 3.5 14 3.5C16.5773 3.5 18.6667 5.58934 18.6667 8.16667Z" fill={color} fill-opacity={opacity} />
    <path d="M16.3333 16.3333H11.6667C8.44501 16.3333 5.83333 18.945 5.83333 22.1667C5.83333 23.4554 6.878 24.5 8.16667 24.5H19.8333C21.122 24.5 22.1667 23.4554 22.1667 22.1667C22.1667 18.945 19.555 16.3333 16.3333 16.3333Z" fill={color} fill-opacity={opacity} />
  </svg>

); 