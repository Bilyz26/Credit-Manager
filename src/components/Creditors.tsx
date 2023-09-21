
import {
  Card,
  CardHeader,
  Typography,
  Button,
} from "@material-tailwind/react";


import DataTable from "./my-reusable-comps/DataTable";
import { AddCreditorForm } from "./creditor-comps/AddCreditorForm";


function Creditors() {
  

  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Creditors 
            </Typography>
          </div>
          <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
            <Button variant="outlined" size="sm">
              view all
            </Button>
            <AddCreditorForm />
          </div>
        </div>
      
      </CardHeader>
      <DataTable />
    </Card>
  );
}

export {Creditors};