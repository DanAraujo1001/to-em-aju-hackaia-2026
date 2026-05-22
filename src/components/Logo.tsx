import React from "react";
import logo from "../assets/images/logo.svg";

export default function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="Logo CIRCUITO CAJU" className={className} />;
}
