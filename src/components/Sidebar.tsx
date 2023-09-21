import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import {
  ChartPieIcon,
  Cog6ToothIcon,
  UserGroupIcon,
  BanknotesIcon,
  BellAlertIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export function Sidebar({setSelectedMenu}) {
  const handleSelection = (menu: string) => {
    setSelectedMenu(menu); // Call the parent component's callback
  };
  return (
    <Card
      className="h-full w-full bg-heumint-light rounded-none max-w-[17rem] 
    p-4  shadow-sm"
    >
      <div className="mb-2 flex items-center gap-4 p-4">
        <img src="src/assets/logo-black.svg" alt="brand" className="h-8 w-8" />

        <Typography variant="h5" className="text-[#1b1e28]">
          Lahmidi
        </Typography>
      </div>
      <div className="h-full w-full flex flex-col justify-between">
      <List className="font-bold">
        <ListItem onClick={() => { handleSelection("Dashboard") }}>
          <ListItemPrefix>
            <ChartPieIcon className="h-5 w-5" />
          </ListItemPrefix>
          Dashboard
        </ListItem>
        <ListItem onClick={() => { handleSelection("Creditors") }}>
          <ListItemPrefix>
            <UserGroupIcon className="h-5 w-5" />
          </ListItemPrefix>
          Creditors
        </ListItem>
        <ListItem onClick={() => { handleSelection("Debts") }}>
          <ListItemPrefix>
            <BanknotesIcon className="h-5 w-5" />
          </ListItemPrefix>
          Add Debt
        </ListItem>
        <ListItem onClick={() => { handleSelection("Alerts") }}>
          <ListItemPrefix>
            <BellAlertIcon className="h-5 w-5" />
          </ListItemPrefix>
          Alerts
          <ListItemSuffix>
            <Chip
              value="14"
              size="sm"
              variant="ghost"
              className="rounded-full bg-heumint-primary text-heumint-light"
            />
          </ListItemSuffix>
        </ListItem>
      </List>

      
      <List className="font-bold">      
          <hr className="my-2 border-blue-gray-50" />

        
        <ListItem onClick={() => { handleSelection("Settings") }}>
          <ListItemPrefix>
            <Cog6ToothIcon className="h-5 w-5" />
          </ListItemPrefix>
          Settings
        </ListItem>
        <ListItem className="font-normal text-heumint-danger" onClick={() => { handleSelection("Logout") }}>
          <ListItemPrefix>
            <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          </ListItemPrefix>
          Log Out
        </ListItem>
      </List>
      </div>
    </Card>
  );
}
