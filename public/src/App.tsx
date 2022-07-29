import * as React from "react";
import { useDispatch } from "react-redux";

export const Application: React.FC = () => {
  let [isLoggedIn, setIsLoggedIn] = React.useState<boolean>(false);
  const dispatch = useDispatch();

  return (<div>Test Demo</div>);
};
