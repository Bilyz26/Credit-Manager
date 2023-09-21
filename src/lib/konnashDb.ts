
import SQLite from "tauri-plugin-sqlite-api";

interface Debt{
  id: number;
  amount: number;
  service: string;
  start_date: number;
  deadline: number;
  creditor_id: number;
  status: number;
}

interface Creditor {
  id: number;
  name: string;
  phone: string
}

class KonnashDB {
  private db: SQLite | null = null;
  constructor() {
    (async () => {
      try {
        this.db = await SQLite.open('./konnash_db.db')
        this.initDb()
      } catch (error) {
        console.error('Error Creating database: ' +
                    (error as Error).message);
      }
    })()
  }

  async initDb() {
    try {
      await this.db?.execute(`
        CREATE TABLE IF NOT EXISTS Creditors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT,
          phone TEXT
        )
      `)
      await this.db?.execute(`
        CREATE TABLE IF NOT EXISTS Debts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          amount INTEGER,
          service TEXT,
          start_date INTEGER,
          deadline INTEGER,
          creditor_id INTEGER, 
          FOREIGN KEY(creditor_id) REFERENCES Creditors (id)
        )
      `)
      console.log('Database initialized successfully!');
      
    } catch (error) {
      console.error('Error initializing database: ' +
                    (error as Error).message);
      
    }
  }

  async closeDb() {
    try {
      await this.db?.close();
      console.log('Database closed successfully!');
    } catch (error) {
      console.error('Error closing database: ' + 
                    (error as Error).message);
    }
  }
  /*  CRUD OF CREDITORS STARTS HEEEEEEEEEEEEER */
  async addC(name: string, phone: string){
    try {
      await this.db?.execute(
        'INSERT INTO Creditors (name, phone) VALUES (?, ?)',
        [name, phone]
      )
      console.log(`Creditor ${name} added successfully!`);
    } catch (error) {
      console.error('Error adding Creditor: ' +
                    (error as Error).message);
    }
  }

  async getAllC(): Promise<Array<Creditor> | null>
   {
    try{
      const rows = await this.db?.select<Array<Creditor>>('SELECT * FROM Creditors')
      if (rows && rows.length > 0) {
        console.log('All Creditors retrieved successfully:');
        return rows;
      } else if (rows && rows.length === 0) {
        console.log('No Creditors found.');
        return [];
      } else {
        console.log('Error retrieving Creditors: Database query returned null.');
        return null;
      }
    }catch (error) {
      console.error('Error retrieving Creditors: ' + (error as Error).message);
      return null;
    }
  }

  async getCById(id: number): Promise<Creditor | null>
  {
    try {
      const row = await this.db?.select<Array<Creditor>>(
        `SELECT * FROM Creditors WHERE id = ?`,
        [id]
      )

      if (row && row.length > 0){
        console.log(`Creditor with ID ${id} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`Creditor with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error getting creditor by Id " +
       (error as Error).message );
       return null;
    }
  }
  
  async getCByName(name: string): Promise<Creditor | null>
  {
    try {
      const row = await this.db?.select<Array<Creditor>>(
        `SELECT * FROM Creditors WHERE name = ?`,
        [name]
      )

      if (row && row.length > 0) {
        console.log(`Creditor with name ${name} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`Creditor with name ${name} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving Creditor: ' + (error as Error).message);
      return null;
    }
  }

  async getAllCByNamePart(namePart: string): Promise<Array<Creditor> | null>
  {
    try {
      const rows = await this.db?.select<Array<Creditor>>(
        'SELECT * FROM Creditors WHERE name like ?',
        [`%${namePart}%`]
      )

      if (rows && rows.length > 0) {
        console.log(`Creditors with names containing "${namePart}" retrieved successfully:`);
        return rows;
      } else {
        console.log(`No Creditors found with names containing "${namePart}".`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving Creditors: ' + (error as Error).message);
      return null;
    }
  }

  async getAllCByPhonePart(phonePart: string): Promise<Array<Creditor> | null>
  {
    try {
      const rows = await this.db?.select<Array<Creditor>>(
        'SELECT * FROM Creditors WHERE phone LIKE ?',
        [`%${phonePart}%`]
      )

      if (rows && rows.length > 0) {
        console.log(`Creditors with phone numbers containing "${phonePart}" retrieved successfully:`)
        return rows;
      } else {
        console.log(`No Creditors found with phone numbers containing "${phonePart}".`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving Creditors: ' + (error as Error).message);
      return null;
    }
  }

  async getCNameById(id: number): Promise<string | null>
  {
    try {
      const row = await this.db?.select<Array<{
        name:string;
      }>>(
        'SELECT name FROM Creditors WHERE id = ?',
        [id]
      )

      if (row && row.length > 0) {
        console.log(`Name of Creditor with ID ${id}: ${row[0].name}`);
        return row[0].name;
      } else {
        console.log(`Creditor with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
        console.error('Error retrieving Creditor name: ' + (error as Error).message);
        return null;
    }
  }

  async getCPhoneById(id: number): Promise<string | null>
  {
    try {
      const row = await this.db?.select<Array<{
        phone:string;
      }>>(
        'SELECT phone FROM Creditors WHERE id = ?',
        [id]
      )

      if (row && row.length > 0) {
        console.log(`Name of Creditor with ID ${id}: ${row[0].phone}`);
        return row[0].phone;
      } else {
        console.log(`Creditor with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
        console.error('Error retrieving Creditor name: ' + (error as Error).message);
        return null;
    }
  }

  async getCByDebtId(id: number): Promise<Creditor | null>
  {
    try {
      const row = await this.db?.select<Array<Creditor>>(
        `SELECT c.*
        FROM Creditors AS c
        INNER JOIN Debts AS d ON c.id = d.creditor_id
        WHERE d.id = ?`,
        [id]
      )

      if (row && row.length > 0) {
        console.log(`Creditor associated with Debt ID ${id} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`No Creditor associated with Debt ID ${id} found.`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving Creditor associated with Debt: ' + (error as Error).message);
      return null;
    }
  }

  /* FOR UPDATING THE Creditors  */

  async upCById(id: number, newName: string, newPhone: string ){
    try {
      await this.db?.execute(
        'UPDATE Creditors SET name = ?, phone = ? WHERE id = ?',
        [newName , newPhone, id ]
      )

      console.log(`Creditor with ID ${id} updated successfully.`);
      
    } catch (error) {
      console.error('Error updating Creditor: ' + (error as Error).message);
    }
  }

  async upCNameById(id: number, newName: string )
  {
    try {
      await this.db?.execute(
        'UPDATE Creditors SET name = ?WHERE id = ?',
        [newName , id ]
      )

      console.log(`Creditor with ID ${id} updated successfully.`);
      
    } catch (error) {
      console.error('Error updating Creditor: ' + (error as Error).message);
    }
  }

  async upCPhoneById(id: number, newPhone: string ){
    try {
      await this.db?.execute(
        'UPDATE Creditors SET phone = ?WHERE id = ?',
        [newPhone , id ]
      )

      console.log(`Creditor with ID ${id} updated successfully.`);
      
    } catch (error) {
      console.error('Error updating Creditor: ' + (error as Error).message);
    }
  }

  async DeleteCById(id: number){
    try { 
      await this.deleteAllDByCreditorId(id)
      await this.db?.execute(
        'DELETE FROM Creditors WHERE id = ?',[id]
      )
      console.log(`Creditor with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting Creditor: ' + (error as Error).message);
    }
  }

  async DELETEAllC(){
    
    try {
      await this.deleteAllD()
      await this.db?.execute(
        'DELETE FROM Creditors'
      )
      console.log('All Creditors deleted successfully.');
    } catch (error) {
      console.error('Error deleting all Creditors: ' + (error as Error).message);
    }
  }


  /*  CRUD OF DEBTS STARTS HEEEEEEEEEEEEER */
  async addD(amount: number, service: string, deadline: number, creditorId: number) {
    try {
      // Calculate the startDate in the format (number) 20230913 (y-m-d)
      const startDate = parseInt(
        new Date().toISOString().slice(0, 10).replace(/-/g, ''),
        10
      );

      // Set status to 1
      const status = 1;

      await this.db?.execute(
        'INSERT INTO Debts (amount, service, start_date, deadline, creditor_id, status) VALUES (?, ?, ?, ?, ?, ?)',
        [amount, service, startDate, deadline, creditorId, status]
      );

      console.log('Debt added successfully.');
    } catch (error) {
      console.error('Error adding Debt: ' + (error as Error).message);
    }
  }

  async upDById(
    id: number,
    newAmount: number,
    newService: string,
    newDeadline: number,
    newStatus: number,
    newCreditorId: number
  ){
    try {
      await this.db?.execute(
        'UPDATE Debts SET amount = ?, service = ?, deadline = ?, status = ?, creditor_id = ? WHERE id = ?',
        [newAmount, newService, newDeadline, newStatus, newCreditorId , id]
      )
      console.log(`Debt with ID ${id} updated successfully.`);
    } catch (error) {   
      console.error('Error updating Debt: ' + (error as Error).message);
    }
  }

  async upDAmountById(id: number, newAmount: number) {
    try {
      await this.db?.execute('UPDATE Debts SET amount = ? WHERE id = ?', [newAmount, id]);
      console.log(`Amount of Debt with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating Debt amount: ' + (error as Error).message);
    }
  }

  async upDServiceById(id: number, newService: string) {
    try {
      await this.db?.execute('UPDATE Debts SET service = ? WHERE id = ?', [newService, id]);
      console.log(`Service of Debt with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating Debt service: ' + (error as Error).message);
    }
  }

  async upDDeadlineById(id: number, newDeadline: number) {
    try {
      await this.db?.execute('UPDATE Debts SET deadline = ? WHERE id = ?', [newDeadline, id]);
      console.log(`Deadline of Debt with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating Debt deadline: ' + (error as Error).message);
    }
  }

  async upDStatusById(id: number, newStatus: number) {
    try {
      await this.db?.execute('UPDATE Debts SET status = ? WHERE id = ?', [newStatus, id]);
      console.log(`Status of Debt with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating Debt status: ' + (error as Error).message);
    }
  }

  async upDCreditorIdById(id: number, newCreditorId: number) {
    try {
      await this.db?.execute('UPDATE Debts SET creditor_id = ? WHERE id = ?', [newCreditorId, id]);
      console.log(`Creditor ID of Debt with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating Debt creditor ID: ' + (error as Error).message);
    }
  }

  async getDById(id: number): Promise<Debt | null> {
    try {
      const row = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE id = ?', [id]
      )
      if (row && row.length > 0) {
        console.log(`Debt with ID ${id} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`Debt with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error('Error retrieving Debt: ' + (error as Error).message);
      return null;
    }
  }

  async getDByAmountRange(
    minAmount: number,
    maxAmount: number): Promise<Array <Debt | null>>{
      try {
        const rows = await this.db?.select<Array<Debt>>(
          'SELECT * FROM Debts WHERE amount >= ? AND amount <= ?',
          [minAmount,maxAmount]
        )
        if (rows && rows.length > 0){
          console.log(`Debts within the amount range ${minAmount} to ${maxAmount} retrieved successfully:`);
          return rows;
        } else {
          console.log(`No Debts found within the specified amount range.`);
          return [];
        }
      } catch (error) {
        console.error('Error retrieving Debts by amount range: ' + (error as Error).message);
        return [];
      }
  }

  async getDByStartDateRange(minStartDate: number, maxStartDate: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE start_date >= ? AND start_date <= ?',
        [minStartDate, maxStartDate]
      );

      if (rows && rows.length > 0) {
        console.log(`Debts within the start date range ${minStartDate} to ${maxStartDate} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found within the specified start date range.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts by start date range: ' + (error as Error).message);
      return [];
    }
  }

  async getDByDeadlineRange(minDeadline: number, maxDeadline: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE deadline >= ? AND deadline <= ?',
        [minDeadline, maxDeadline]
      );

      if (rows && rows.length > 0) {
        console.log(`Debts within the deadline range ${minDeadline} to ${maxDeadline} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found within the specified deadline range.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts by deadline range: ' + (error as Error).message);
      return [];
    }
  }

  async getDByStatus(status: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE status = ?',
        [status]
      );

      if (rows && rows.length > 0) {
        console.log(`Debts with status ${status} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found with the specified status.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts by status: ' + (error as Error).message);
      return [];
    }
  }

  async getAllDByCreditorId(creditorId: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE creditor_id = ?',
        [creditorId]
      );

      if (rows && rows.length > 0) {
        console.log(`Debts associated with Creditor ID ${creditorId} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found associated with the specified Creditor ID.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts by Creditor ID: ' + (error as Error).message);
      return [];
    }
  }

  async getAllDTotalAmountByCreditorId(creditorId: number): Promise<number> {
    try {
      const result = await this.db?.select<Array<{ totalAmount: number }>>(
        'SELECT SUM(amount) AS totalAmount FROM Debts WHERE creditor_id = ?',
        [creditorId]
      );

      if (result && result.length > 0 && result[0].totalAmount !== null) {
        const totalAmount = result[0].totalAmount;
        console.log(`Total amount of Debts associated with Creditor ID ${creditorId}: ${totalAmount}`);
        return totalAmount;
      } else {
        console.log(`No Debts found associated with the specified Creditor ID or total amount is null.`);
        return 0;
      }
    } catch (error) {
      console.error('Error retrieving total amount of Debts by Creditor ID: ' + (error as Error).message);
      return 0;
    }
  }

  async getAllDTotalAmountByStatus(status: number): Promise<number> {
    try {
      const result = await this.db?.select<Array<{ totalAmount: number }>>(
        'SELECT SUM(amount) AS totalAmount FROM Debts WHERE status = ?',
        [status]
      );

      if (result && result.length > 0 && result[0].totalAmount !== null) {
        const totalAmount = result[0].totalAmount;
        console.log(`Total amount of Debts with status ${status}: ${totalAmount}`);
        return totalAmount;
      } else {
        console.log(`No Debts found with the specified status or total amount is null.`);
        return 0;
      }
    } catch (error) {
      console.error('Error retrieving total amount of Debts by status: ' + (error as Error).message);
      return 0;
    }
  }

  async getAllDTotalAmount(): Promise<number> {
    try {
      const result = await this.db?.select<Array<{ totalAmount: number }>>(
        'SELECT SUM(amount) AS totalAmount FROM Debts'
      );

      if (result && result.length > 0 && result[0].totalAmount !== null) {
        const totalAmount = result[0].totalAmount;
        console.log(`Total amount of all Debts: ${totalAmount}`);
        return totalAmount;
      } else {
        console.log(`No Debts found or total amount is null.`);
        return 0;
      }
    } catch (error) {
      console.error('Error retrieving total amount of all Debts: ' + (error as Error).message);
      return 0;
    }
  }

  async deleteDById(id: number): Promise<void> {
    try {
      await this.db?.execute('DELETE FROM Debts WHERE id = ?', [id]);
      console.log(`Debt with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting Debt: ' + (error as Error).message);
    }
  }

  async deleteAllDByCreditorId(creditorId: number): Promise<void> {
    try {
      await this.db?.execute('DELETE FROM Debts WHERE creditor_id = ?', [creditorId]);
      console.log(`All Debts associated with Creditor ID ${creditorId} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting Debts by Creditor ID: ' + (error as Error).message);
    }
  }

  async deleteAllD(): Promise<void> {
    try {
      await this.db?.execute('DELETE FROM Debts');
      console.log(`All Debts deleted successfully.`);
    } catch (error) {
      console.error('Error deleting all Debts: ' + (error as Error).message);
    }
  }

}

const KONNASH = new KonnashDB();
export type {Creditor, Debt};
export default KONNASH;
