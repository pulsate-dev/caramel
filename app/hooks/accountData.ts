import { useEffect, useState } from "react";
import { LoggedInAccountData } from "~/lib/login";

export const useLoggedInAccount = () => {
  const [account, setAccount] = useState<LoggedInAccountData>({
    id: "",
    name: "",
    nickname: "",
  });

  useEffect(() => {
    localStorage.setItem("accountData", JSON.stringify(account));
    console.log("updated", account);
  }, [account]);

  if (typeof window !== "undefined") {
    const accountRes = localStorage.getItem("accountData");
    if (accountRes == null) {
      return {
        account,
        setAccount,
      };
    }
    const accountData = JSON.parse(accountRes) as LoggedInAccountData
    // setAccount(accountData);
  }

  return {
    account,
    setAccount,
  };
};
