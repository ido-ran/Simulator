import React from "react";
import "./Header.css";
import { Divider } from "../Common/Divider";
import { Link, useRouteMatch } from "react-router-dom";
import brandImage from "./logo.gif";
import { useSelector } from "react-redux";
import { getCurrentBlocklyProgram } from "../../../BlocklyInterface/blocklySlice";
import { Icon, IconName } from "../Common/Icon";

export const Brand = () => {
  return (
    <Link to="/" className="brand-image-link">
      <div className="brand-image-container">
        <img className="brand" src={brandImage} alt="FIRST Robotics" />
      </div>
    </Link>
  );
};

export const Header = () => {
  const match = useRouteMatch<{ lesson: string; challenge: string }>({
    path: "/lessons/:lesson/challenges/:challenge/",
    strict: true,
    sensitive: true,
  });

  const currentProgram = useSelector(getCurrentBlocklyProgram);

  return (
    <div className="header">
      <Brand />
      {match ? (
        <>
          <h1>{match.params.challenge}</h1>
          <Divider vertical />
        </>
      ) : null}
      {currentProgram && match ? (
        <h1 className="header--program-title">
          <Icon
            className="header--program-title-icon"
            iconName={IconName.file}
          />{" "}
          {currentProgram.title}
        </h1>
      ) : null}
    </div>
  );
};
