import React, {createContext, useContext, useEffect, useMemo, useReducer} from "react";
import { AccountAction, AccountState } from "../../types/types";
import { ACCOUNT_STORAGE_KEY } from "../../utilities/constant";
import { accountReducer } from "./accountReducer";

type AccountContextType = {
  state: AccountState;
  dispatch: React.Dispatch<any>;
};

const AccountContext = createContext<AccountContextType | undefined>(undefined);

const loadInitialState = (): AccountState => {
  try 
  {
    const stored = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (stored) 
    {
      const parsed = JSON.parse(stored);
      return {
        accountDetails: parsed.accountDetails,
        loading: false,
        error: null,
        outGoingUrl: parsed.outGoingUrl || null
      };
    }
  } 
  catch (error) 
  {
    console.error("Failed to load state", error);
  }

  return {
    accountDetails: null,
    loading: false,
    error: null,
    outGoingUrl: null
  };
};

export const AccountProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(accountReducer, undefined,loadInitialState);

  useEffect(() => {
    try 
    {
      if(state.accountDetails || state.outGoingUrl)
      {
        localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(state));
      }
    } 
    catch (e) 
    {
      console.error("Failed to save state", e);
    }
  }, [state.accountDetails, state.outGoingUrl]);

  const value = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]);

  return (
    <AccountContext.Provider value={value}>
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within StudentProvider");
  }
  return context;
};
