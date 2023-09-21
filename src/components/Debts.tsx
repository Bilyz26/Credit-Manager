import {  Card, CardBody, CardHeader, Typography } from "@material-tailwind/react"
import { Input } from "./ui/input"
import { Button } from "./ui/button" 
import { useState } from "react"
import { Combobox } from "@headlessui/react"
import { HiPlus, HiUserPlus } from "react-icons/hi2"
import DataTable from "./my-reusable-comps/DataTable"


const people = [
  'Durward Reynolds',
  'Kenton Towne',
  'Therese Wunsch',
  'Benedict Kessler',
  'Katelyn Rohan',
]

function MyCombobox() {
  const [selectedPerson, setSelectedPerson] = useState(people[0])
  const [query, setQuery] = useState('')

  const filteredPeople =
    query === ''
      ? people
      : people.filter((person) => {
          return person.toLowerCase().includes(query.toLowerCase())
        })

  return (
    <Combobox value={selectedPerson} onChange={setSelectedPerson}>
      <Combobox.Input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50" 
      onChange={(event) => setQuery(event.target.value)} />
      <Combobox.Options>
        {filteredPeople.map((person) => (
          <Combobox.Option key={person} value={person}>
            {person}
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  )
}
function Debts() {
  return (
    <Card className="h-full w-full">
      <CardHeader floated={false} shadow={false} className="rounded-none">
        <div className="mb-8 flex items-center justify-between gap-8">
          <div>
            <Typography variant="h5" color="blue-gray">
              Add Debt 
            </Typography>
          </div>
         
        </div>
      
      </CardHeader>
      <CardBody className="flex flex-col justify-center space-y-10">
        <div className="flex justify-start pl-2 gap-5 ">
          <div className="flex flex-col w-56">
            <span className="text-sm text-[#121212]">Select a client</span>
            <MyCombobox/>
          </div>
          <div className="flex flex-col w-56">
            <span className="text-sm text-[#121212]">Amount</span>
            <Input placeholder="100 DH"/>
          </div>
          <div className="flex flex-col w-56">
            <span className="text-sm text-[#121212]">Select a category</span>
            <MyCombobox/>
          </div>
          <div className="flex flex-col w-fit">
            <Button className="translate-y-5"  size='icon'>
              <HiPlus className="text-white"/>
            </Button>
          </div>
          
        </div>

        <div className="w-full">
        <DataTable />
        </div>
      </CardBody>
    </Card>
  )
}

export default Debts