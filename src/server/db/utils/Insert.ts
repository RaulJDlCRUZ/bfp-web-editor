// AQUI IMPLEMENTAR SINGLETON
export default class Insert {
  // Static method to insert data into the database
  static async insertData(
    tableName: string,
    data: Record<string, any>
  ): Promise<void> {
    try {
      // Example query logic (replace with actual database logic)
      const query = `INSERT INTO ${tableName} (${Object.keys(data).join(
        ", "
      )}) VALUES (${Object.values(data)
        .map(() => "?")
        .join(", ")})`;
      console.log("Executing query:", query);
      // Execute the query using your database client
      // await dbClient.execute(query, Object.values(data));
    } catch (error) {
      console.error("Error inserting data:", error);
      throw error;
    }
  }
}

export class InsertFromArray extends Insert {
  // Static method to insert data from an array into the database
  static async insertArrayData(
    tableName: string,
    dataArray: Array<Record<string, any>>
  ): Promise<void> {
    try {
      for (const data of dataArray) {
        await this.insertData(tableName, data);
      }
    } catch (error) {
      console.error("Error inserting array data:", error);
      throw error;
    }
  }
}

export class InsertFromArrayRecordNumberUnique extends Insert {
  // Static method to insert data from an array of records with unique numbers into the database
  static async insertArrayDataWithUniqueNumber(
    tableName: string,
    dataArray: Array<Record<number, Record<string, any>>>
  ): Promise<void> {
    try {
      for (const record of dataArray) {
        const number = Object.keys(record)[0]; // Get the unique number key
        const data = record[number]; // Get the associated data
        await this.insertData(tableName, { ...data, number });
      }
    } catch (error) {
      console.error("Error inserting array data with unique number:", error);
      throw error;
    }
  }
}

export class InsertFromArrayRecordString extends Insert {
  // Static method to insert data from an array of records with string keys into the database
  static async insertArrayDataWithStringKeys(
    tableName: string,
    dataArray: Array<Record<string, Record<string, any>>>
  ): Promise<void> {
    try {
      for (const record of dataArray) {
        const key = Object.keys(record)[0]; // Get the string key
        const data = record[key]; // Get the associated data
        await this.insertData(tableName, { ...data, key });
      }
    } catch (error) {
      console.error("Error inserting array data with string keys:", error);
      throw error;
    }
  }
}