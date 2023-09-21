import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { Alert, Button, Input } from "@material-tailwind/react"
import { PhoneIcon, UserIcon, UserPlusIcon } from "@heroicons/react/24/solid"
import TRACKERDB from "@/lib/TrackerDB";

let konn = TRACKERDB
konn.initDb()
function ClosableWarn({warn}: {warn: string}) {
    const [open, setOpen] = useState(true);
   
    return (
      <>
        <Alert variant="outlined" color="gray" open={open} onClose={() => setOpen(false)}>
        
         {warn}
        </Alert>
      </>
    );
  }
  
function AddCreditorForm() {
    const [nameErr, setNameErr] = useState("")
    const [phoneErr, setPhoneErr] = useState("")
    const [nameIsValid, setNameIsValid] = useState(true)
    const [phoneIsValid, setPhoneIsValid] = useState(true)
    const [phoneTooLong, setPhoneTooLong] = useState(false)
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
  
  
    const handNameChange  = (n: string) => { 
      setNameIsValid(true)
      setName(n)
     }
    const handPhoneChange = (p: string) => { 
      setPhoneIsValid(true)
      if (p[0] === "0" || !Number.parseInt(p[p.length -1])) {
       p = p.slice(0, -1)
      }
      if (p.length > 9) {
  
        setPhoneTooLong(true)
        setPhoneErr("Phone number longer than a Moroccan number")
      } else {
        setPhoneTooLong(false)
        setPhoneErr("")
      }
      setPhone(p)
     }
    const handleSubmit = () => { 
      setPhone(phone.toString())
      if (!name) {
        setNameIsValid(false)
        setNameErr('Enter a name')
      } else if (name.length < 3) {
        setNameIsValid(false)
        setNameErr('Name must be at least 3 characters long')
      } else {
        setNameIsValid(true)
        setNameErr("")
      }


      if ( phone.length < 9 && phone.length > 0) {
        setPhoneIsValid(false)
        setPhoneErr('Phone mumber must be at leat 9 digits long')
      }else if (!phone) {
        setPhoneIsValid(false)
        setPhoneErr('Enter a phone number')
      }else {
        setPhoneIsValid(true)
      }
      if (nameIsValid && phoneIsValid) {
        try {
            konn.addC(name, phone)
        } catch (error) {
            console.log('Creditor failed at form adding logic level' + error);
            
        }
      }
    }
    const [showPhonePrefix, setShowPhonePrefix] = useState(false)
   
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-3" size="sm">
                <UserPlusIcon strokeWidth={2} className="h-4 w-4" /> Add Creditor
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Creditor</DialogTitle>
            <DialogDescription>
              Insert creditor to your database here. Click Add when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4 content-center py-4">
            <div className="grid grid-cols-1 items-center gap-4">
              <Input label="Name" icon={<UserIcon />} value={name} onChange={(e): void => { handNameChange(e.target.value) }} error={!nameIsValid} />
              
            </div> 
            <div className="grid grid-cols-1 w-60 items-center gap-4">
              <div className="flex"> 
              <div className={`${showPhonePrefix || phone ? "opacity-100" : "opacity-0"} h-6 phonesfix w-12 absolute translate-x-2 translate-y-2  flex items-center justify-center text-xs text-blue-gray-800 font-semibold  rounded-l-lg bg-gray-200`}>
                {phoneTooLong ? "+" :  "+212"}
              </div>
              <Input className={showPhonePrefix || phone ? "pl-16" : ""} onBlur={() => { setShowPhonePrefix(false) }} onFocus={() => { setShowPhonePrefix(true) }} color={phoneTooLong ? "amber" : undefined} label="Phone" icon={<PhoneIcon />} value={phone} error={!phoneIsValid}  onChange={(e): void => { handPhoneChange(e.target.value) } }/>
              </div>
            </div>
             {phoneTooLong ? <ClosableWarn warn={phoneErr} /> : ''}
             {!nameIsValid ? <Alert color="red">{nameErr}</Alert> : ''}
             {!phoneIsValid ? <Alert color="red">{phoneErr}</Alert> : ''}
          </div>
          <DialogFooter>
            <Button onClick={() => { handleSubmit() }} type="submit">Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }
  
  export {AddCreditorForm, ClosableWarn}