import SQLite from "tauri-plugin-sqlite-api";

interface Client {
  id: number;
  name: string;
  phone: string;
}

interface Category {
  id: number;
  catName: string;
}

interface Debt {
  id: number;
  clientId: number;
  categoryId: number;
  amount: number;
  remaining: number;
  date: number;
}

interface DebtHistory {
  id: number;
  debtId: number;
  amount: number;
  paymentDate: number;
}

class TrackerDb {
  private db: SQLite | null = null;
  constructor() {
    (async () => {
      try {
        this.db = await SQLite.open("./tracker.db");
        await this.initDb();
      } catch (error) {
        console.error("Error Creating database: " + (error as Error).message);
      }
    })();
  }

  async initDb(): Promise<void> {
    try {
      await this.db?.execute(`
        CREATE TABLE IF NOT EXISTS Categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
        );            
      `);

      await this.db?.execute(`
        CREATE TABLE IF NOT EXISTS  Clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT
        );
      `);
      await this.db?.execute(`
        CREATE TABLE IF NOT EXISTS Debts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientID INTEGER NOT NULL,
            amount INTEGER NOT NULL,
            remaining INTEGER NOT NULL,
            date INTEGER NOT NULL,
            categoryID INTEGER NOT NULL,
            FOREIGN KEY (clientID) REFERENCES Clients (id),
            FOREIGN KEY (categoryID) REFERENCES Categories (id)
        );
      `);
      await this.db?.execute(`
        CREATE TABLE IF NOT EXISTS clientPayments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            clientID INTEGER NOT NULL,
            amountPaid INTEGER NOT NULL,
            paymentDate INTEGER NOT NULL,
            FOREIGN KEY (debtID) REFERENCES Debts (id)
        )
      `);
      console.log("Database initialized successfully!");
    } catch (error) {
      console.error("Error initializing database: " + (error as Error).message);
    }
  }

  async closeDb(): Promise<void> {
    try {
      await this.db?.close();
      console.log("Database closed successfully!");
    } catch (error) {
      console.error("Error closing database: " + (error as Error).message);
    }
  }

  async addC(name: string, phone: string): Promise<void> {
    try {
      await this.db?.execute(
        "INSERT INTO Clients (name, phone) VALUES (?, ?)",
        [name, phone]
      );
      console.log(`Client ${name} added successfully!`);
    } catch (error) {
      console.error("Error adding Client: " + (error as Error).message);
    }
  }

  async getAllC(): Promise<Array<Client> | null> {
    try {
      const rows = await this.db?.select<Array<Client>>(
        "SELECT * FROM Clients"
      );
      if (rows && rows.length > 0) {
        console.log("All Clients retrieved successfully:");
        return rows;
      } else if (rows && rows.length === 0) {
        console.log("No Clients found.");
        return [];
      } else {
        console.log("Error retrieving Clients: Database query returned null.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving Clients: " + (error as Error).message);
      return null;
    }
  }
  async getCById(id: number): Promise<Client | null> {
    try {
      const row = await this.db?.select<Array<Client>>(
        `SELECT * FROM Clients WHERE id = ?`,
        [id]
      );

      if (row && row.length > 0) {
        console.log(`Client with ID ${id} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`Client with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error getting Client by Id " + (error as Error).message);
      return null;
    }
  }

  async getAllCByNamePart(namePart: string): Promise<Array<Client> | null> {
    try {
      const rows = await this.db?.select<Array<Client>>(
        "SELECT * FROM Clients WHERE name like ?",
        [`%${namePart}%`]
      );

      if (rows && rows.length > 0) {
        console.log(
          `Clients with names containing "${namePart}" retrieved successfully:`
        );
        return rows;
      } else {
        console.log(`No Clients found with names containing "${namePart}".`);
        return null;
      }
    } catch (error) {
      console.error("Error retrieving Clients: " + (error as Error).message);
      return null;
    }
  }

  async getAllCByPhonePart(phonePart: string): Promise<Array<Client> | null> {
    try {
      const rows = await this.db?.select<Array<Client>>(
        "SELECT * FROM Clients WHERE phone LIKE ?",
        [`%${phonePart}%`]
      );

      if (rows && rows.length > 0) {
        console.log(
          `Clients with phone numbers containing "${phonePart}" retrieved successfully:`
        );
        return rows;
      } else {
        console.log(
          `No Clients found with phone numbers containing "${phonePart}".`
        );
        return null;
      }
    } catch (error) {
      console.error("Error retrieving Clients: " + (error as Error).message);
      return null;
    }
  }

  async getCByDebtId(id: number): Promise<Client | null> {
    try {
      const row = await this.db?.select<Array<Client>>(
        `SELECT cl.*
            FROM Clients AS cl
            INNER JOIN Debts AS d ON cl.id = d.clientID
            WHERE d.id = ?`,
        [id]
      );

      if (row && row.length > 0) {
        console.log(
          `Client associated with Debt ID ${id} retrieved successfully:`
        );
        return row[0];
      } else {
        console.log(`No Client associated with Debt ID ${id} found.`);
        return null;
      }
    } catch (error) {
      console.error(
        "Error retrieving Client associated with Debt: " +
          (error as Error).message
      );
      return null;
    }
  }

  async upCById(id: number, newName: string, newPhone: string): Promise<void> {
    try {
      await this.db?.execute(
        "UPDATE Clients SET name = ?, phone = ? WHERE id = ?",
        [newName, newPhone, id]
      );

      console.log(`Client with ID ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating Client: " + (error as Error).message);
    }
  }

  async DeleteCById(id: number): Promise<void> {
    try {
      await this.deleteAllDByClientId(id);
      await this.db?.execute("DELETE FROM Clients WHERE id = ?", [id]);
      console.log(`Client with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting Client: " + (error as Error).message);
    }
  }

  async DELETEAllC(): Promise<void> {
    try {
      await this.deleteAllD();
      await this.db?.execute("DELETE FROM Clients");
      console.log("All Clients deleted successfully.");
    } catch (error) {
      console.error("Error deleting all Clients: " + (error as Error).message);
    }
  }

  /**************DEBTS DDDDDDDDDDDDDDDD**************** */

  async addD(amount: number, clientID: number, categoryID: number): Promise<void> {
    // Calculate the startDate in the format (number) 20230913 (y-m-d)
    const date = parseInt(
      new Date().toISOString().slice(0, 10).replace(/-/g, ""),
      10
    );
    try {
      await this.db?.execute(
        `
        INSERT INTO Debts (clientID, categoryID, amount, date) VALUES (?,?,?,?,?)
      `,
        [clientID, categoryID, amount, date, amount]
      );
      console.log("Debt added successfully.");
    } catch (error) {
      console.error("Error adding Debt: " + (error as Error).message);
    }
  }

  async upDById(
    id: number,
    amount: number,
    clientID: number,
    categoryID: number
  ): Promise<void> {
    try {
      await this.db?.execute('UPDATE Debts set amount = ?, clientID = ?, categoryID = ? WHERE id = ?'
      , [amount ,clientID, categoryID, id])
      console.log(`Debt with ID ${id} updated successfully.`);
    } catch (error) {
      console.error('Error updating Debt: ' + (error as Error).message);

    }
  }

  async upDRemainingByIdMinus(debtId: number, amountPaid: number): Promise<void> {
    try {
      await this.db?.execute(
        "UPDATE Debts SET remaining = remaining - ? WHERE id = ?",
        [amountPaid, debtId]
      );
  
      console.log(`Remaining amount for Debt with ID ${debtId} updated successfully.`);
    } catch (error) {
      console.error("Error updating remaining amount for Debt: " + (error as Error).message);
    }
  }

  async upDRemainingByIdMinusPlus(debtId: number, amountPaid: number): Promise<void> {
    try {
      await this.db?.execute(
        "UPDATE Debts SET remaining = remaining + ? WHERE id = ?",
        [amountPaid, debtId]
      );
  
      console.log(`Remaining amount for Debt with ID ${debtId} updated successfully.`);
    } catch (error) {
      console.error("Error updating remaining amount for Debt: " + (error as Error).message);
    }
  }
  
  async getAllD(): Promise<Array<Debt>>{
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts'
      )
      if (rows && rows.length > 0) {
        console.log(`Debts are all retrieved successfully:`);
        return rows
      } else {
        console.log(`No Debts found.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts: ' + (error as Error).message);
      return [];
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

  async getDByDateRange(minDate: number, maxDate: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE date >= ? AND date <= ?',
        [minDate, maxDate]
      );

      if (rows && rows.length > 0) {
        console.log(`Debts within the start date range ${minDate} to ${maxDate} retrieved successfully:`);
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

  async getDByNoRemaining(): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE remaining > 0'
      );

      if (rows && rows.length > 0) {
        console.log(`Debts with no remaining retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found with the no remaining.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving no remaining Debts: ' + (error as Error).message);
      return [];
    }
  }

  async getAllDByClientID(clientID: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE clientID = ?',
        [clientID]
      );

      if (rows && rows.length > 0) {
        console.log(`Debts associated with Client ID ${clientID} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found associated with the specified Client ID.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts by Client ID: ' + (error as Error).message);
      return [];
    }
  }
  async getAllDByCategoryId(categoryID: number): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT * FROM Debts WHERE categoryID = ?',
        [categoryID]
      );
  
      if (rows && rows.length > 0) {
        console.log(`Debts with Category ID ${categoryID} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found with Category ID ${categoryID}.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving Debts by Category ID: ' + (error as Error).message);
      return [];
    }
  }

  
  async getAllDTotalAmountByClientID(clientID: number): Promise<number> {
    try {
      const result = await this.db?.select<Array<{ totalAmount: number }>>(
        'SELECT SUM(amount) AS totalAmount FROM Debts WHERE clientID = ?',
        [clientID]
      );

      if (result && result.length > 0 && result[0].totalAmount !== null) {
        const totalAmount = result[0].totalAmount;
        console.log(`Total amount of Debts associated with Client ID ${clientID}: ${totalAmount}`);
        return totalAmount;
      } else {
        console.log(`No Debts found associated with the specified Client ID or total amount is null.`);
        return 0;
      }
    } catch (error) {
      console.error('Error retrieving total amount of Debts by Client ID: ' + (error as Error).message);
      return 0;
    }
  }

  async getDTotalAmountByNoRemaining(): Promise<Array<Debt>> {
    try {
      const rows = await this.db?.select<Array<Debt>>(
        'SELECT SUM(amount) AS totalAmount  FROM Debts WHERE remaining > 0'
      );

      if (rows && rows.length > 0) {
        console.log(`Debts with no remaining retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debts found with the no remaining.`);
        return [];
      }
    } catch (error) {
      console.error('Error retrieving no remaining Debts: ' + (error as Error).message);
      return [];
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


  async deleteAllDByClientId(clientID: number): Promise<void> {
    try {
      await this.deleteAllDebtHistoryByClientId(clientID)
      await this.db?.execute('DELETE FROM Debts WHERE clientID = ?', [clientID]);
      console.log(`All Debts associated with Client ID ${clientID} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting Debts by Client ID: ' + (error as Error).message);
    }
  }
  async deleteDById(id: number): Promise<void> {
    try {
      await this.deleteDebtHistoryById(id)
      
      await this.db?.execute('DELETE FROM Debts WHERE id = ?', [id]);
      console.log(`Debt with ID ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting Debt: ' + (error as Error).message);
    }
  }

  async deleteAllD(): Promise<void> {
    try {
      await this.deleteAllDebtHistory()
      await this.db?.execute('DELETE FROM Debts');
      console.log(`All Debts deleted successfully.`);
    } catch (error) {
      console.error('Error deleting all Debts: ' + (error as Error).message);
    }
  }


  //#^@_×_×^#_#_×_#_#_×   Categories CRUUUUUUD
  async addCategory(name: string): Promise<void> {
    try {
      await this.db?.execute("INSERT INTO Categories (name) VALUES (?)", [name]);
      console.log(`Category ${name} added successfully!`);
    } catch (error) {
      console.error("Error adding Category: " + (error as Error).message);
    }
  }
  
  async getAllCategories(): Promise<Array<Category> | null> {
    try {
      const rows = await this.db?.select<Array<Category>>(
        "SELECT * FROM Categories"
      );
      if (rows && rows.length > 0) {
        console.log("All Categories retrieved successfully:");
        return rows;
      } else if (rows && rows.length === 0) {
        console.log("No Categories found.");
        return [];
      } else {
        console.log("Error retrieving Categories: Database query returned null.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving Categories: " + (error as Error).message);
      return null;
    }
  }
  
  async getCategoryById(id: number): Promise<Category | null> {
    try {
      const row = await this.db?.select<Array<Category>>(
        `SELECT * FROM Categories WHERE id = ?`,
        [id]
      );
  
      if (row && row.length > 0) {
        console.log(`Category with ID ${id} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`Category with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error getting Category by Id " + (error as Error).message);
      return null;
    }
  }
  
  async upCategoryById(id: number, newName: string): Promise<void> {
    try {
      await this.db?.execute("UPDATE Categories SET name = ? WHERE id = ?", [
        newName,
        id,
      ]);
      console.log(`Category with ID ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating Category: " + (error as Error).message);
    }
  }
  async deleteCategoryById(id: number): Promise<boolean> {
    try {
      // Check if the category is associated with any debts
      const debtCount = await this.db?.select<number>(
        "SELECT COUNT(*) FROM Debts WHERE categoryID = ?",
        [id]
      );
  
      if (debtCount === null) {
        console.error("Error checking if the category is associated with debts.");
        return false;
      }
  
      if (debtCount !== undefined && debtCount > 0) {
        console.log(`Category with ID ${id} cannot be deleted because it is associated with ${debtCount} debts.`);
        return false;
      }
  
      // If there are no associated debts, proceed with deletion
      await this.db?.execute("DELETE FROM Categories WHERE id = ?", [id]);
      console.log(`Category with ID ${id} deleted successfully.`);
      return true;
    } catch (error) {
      console.error("Error deleting Category: " + (error as Error).message);
      return false;
    }
  }
  //:#&#€×€××&#^@&&÷&@£@&&@£@£#& DebtHistory CRUUUUUUUD

  async addDebtHistory(debtId: number, amountPaid: number): Promise<void> {
    try {
      await this.upDRemainingByIdMinus(debtId, amountPaid)
      const paymentDate = parseInt(
        new Date().toISOString().slice(0, 10).replace(/-/g, ""),
        10
      );
  
      await this.db?.execute(
        "INSERT INTO DebtHistory (debtId, amountPaid, paymentDate) VALUES (?, ?, ?)",
        [debtId, amountPaid, paymentDate]
      );
      console.log("Debt history added successfully.");
    } catch (error) {
      console.error("Error adding Debt history: " + (error as Error).message);
    }
  }
  
  async getDebtHistoryById(id: number): Promise<DebtHistory | null> {
    try {
      const row = await this.db?.select<Array<DebtHistory>>(
        "SELECT * FROM DebtHistory WHERE id = ?",
        [id]
      );
      if (row && row.length > 0) {
        console.log(`Debt history with ID ${id} retrieved successfully:`);
        return row[0];
      } else {
        console.log(`Debt history with ID ${id} not found.`);
        return null;
      }
    } catch (error) {
      console.error("Error retrieving Debt history: " + (error as Error).message);
      return null;
    }
  }

  async getAllDebtHistoryByDebtId(debtId: number): Promise<Array<DebtHistory>> {
    try {
      const rows = await this.db?.select<Array<DebtHistory>>(
        "SELECT * FROM DebtHistory WHERE debtId = ?",
        [debtId]
      );
  
      if (rows && rows.length > 0) {
        console.log(`Debt history associated with Debt ID ${debtId} retrieved successfully:`);
        console.log(rows);
        return rows;
      } else {
        console.log(`No Debt history found associated with Debt ID ${debtId}.`);
        return [];
      }
    } catch (error) {
      console.error("Error retrieving Debt history by Debt ID: " + (error as Error).message);
      return [];
    }
  }
  
  
  async upDebtHistoryById(
    id: number,
    amountPaid: number,
  ): Promise<void> {
    try {
      const debtHistory = await this.db?.select<Array<DebtHistory>>(`
        SELECT * FROM DebtHistory WHERE id = ?
      `, [id])

      if (debtHistory && debtHistory.length > 0) {
        const {debtId, amount: oldPaidPaidAmount} = debtHistory[0]

        await this.upDRemainingByIdMinusPlus(debtId, oldPaidPaidAmount)
        await this.upDRemainingByIdMinus(debtId, amountPaid)
        await this.db?.execute(
          "UPDATE DebtHistory SET amountPaid = ?, paymentDate = ? WHERE id = ?",
          [amountPaid, id]
        );
      }
      console.log(`Debt history with ID ${id} updated successfully.`);
    } catch (error) {
      console.error("Error updating Debt history: " + (error as Error).message);
    }
  }
  
  async deleteDebtHistoryById(id: number): Promise<void> {
    try {
        // Retrieve the debtId and amountPaid from the DebtHistory record
        const debtHistory = await this.db?.select<Array<DebtHistory>>(
            "SELECT debtId, amountPaid FROM DebtHistory WHERE id = ?",
            [id]
        );

        if (debtHistory && debtHistory.length > 0) {
            const { debtId, amount } = debtHistory[0];

            // Undo the remaining amount subtraction by adding amountPaid
            await this.upDRemainingByIdMinusPlus(debtId, amount);

            // Delete the DebtHistory record
            await this.db?.execute("DELETE FROM DebtHistory WHERE id = ?", [id]);
            console.log(`Debt history with ID ${id} deleted successfully.`);
        } else {
            console.log(`Debt history with ID ${id} not found.`);
        }
    } catch (error) {
        console.error("Error deleting Debt history: " + (error as Error).message);
    }
}

  
  async deleteAllDebtHistoryByDebtId(debtId: number): Promise<void> {
    try {
      await this.db?.execute("DELETE FROM DebtHistory WHERE debtId = ?", [debtId]);
      console.log(`All Debt history associated with Debt ID ${debtId} deleted successfully.`);
    } catch (error) {
      console.error("Error deleting Debt history by Debt ID: " + (error as Error).message);
    }
  }
  async deleteAllDebtHistoryByClientId(clientID: number): Promise<void> {
    try {
      // Get all debt IDs associated with the client
      const debtIds = await this.db?.select<number[]>(
        'SELECT id FROM Debts WHERE clientID = ?',
        [clientID]
      );
  
      if (debtIds) {
        // Delete DebtHistory records associated with each debt
        for (const debtId of debtIds) {
          await this.db?.execute('DELETE FROM DebtHistory WHERE debtId = ?', [debtId]);
          console.log(`DebtHistory records associated with Debt ID ${debtId} deleted successfully.`);
        }
  
        console.log(`All DebtHistory records associated with Client ID ${clientID} deleted successfully.`);
      } else {
        console.log(`No DebtHistory records found for Client ID ${clientID}.`);
      }
    } catch (error) {
      console.error('Error deleting DebtHistory records by Client ID: ' + (error as Error).message);
    }
  }
  
  async deleteAllDebtHistory(): Promise<void> {
    try {
      await this.db?.execute("DELETE FROM DebtHistory");
      console.log("All Debt history deleted successfully.");
    } catch (error) {
      console.error("Error deleting all Debt history: " + (error as Error).message);
    }
  }
  
}

const TRACKERDB = new TrackerDb()
export default TRACKERDB

export type {Client, Debt, Category, DebtHistory}