import { useContext } from "react";
import { authContext } from "../context/authContextCreator";

export function useAuth() {
  return useContext(authContext);
}
