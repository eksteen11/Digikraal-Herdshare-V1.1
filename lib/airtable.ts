import Airtable from "airtable";

// Initialize Airtable client
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY,
}).base(process.env.AIRTABLE_BASE_ID!);

const USERS_TABLE = process.env.AIRTABLE_TABLE_USERS || "Users";
const TRANSACTIONS_TABLE = process.env.AIRTABLE_TABLE_TRANSACTIONS || "Data - Transactions";

// ==================== USERS TABLE ====================

export interface AirtableUser {
  id: string;
  fields: {
    "User Name"?: string;
    "User Email"?: string;
    "User Password"?: string;
    "Role"?: "Admin" | "Partner" | "Investor" | "Farmer";
    "Investment #1"?: string;
    "Investment #2"?: string;
    "Total Investment Amount"?: string;
    "Data - Transaskies"?: string[];
    "Data - Transaskies 2"?: string[];
    "Data - Transaskies 3"?: string[];
    "Data - Transaskies 4"?: string[];
    [key: string]: any; // Allow for any other fields
  };
}

/**
 * Get a user by email
 */
export async function getUserByEmail(email: string): Promise<AirtableUser | null> {
  try {
    const records = await base(USERS_TABLE)
      .select({
        filterByFormula: `{User Email} = "${email}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;

    return {
      id: records[0].id,
      fields: records[0].fields as AirtableUser["fields"],
    };
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
}

/**
 * Get a user by ID
 */
export async function getUserById(id: string): Promise<AirtableUser | null> {
  try {
    const record = await base(USERS_TABLE).find(id);
    return {
      id: record.id,
      fields: record.fields as AirtableUser["fields"],
    };
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

/**
 * Create a new user
 */
export async function createUser(fields: Partial<AirtableUser["fields"]>): Promise<AirtableUser> {
  try {
    const records = await base(USERS_TABLE).create([
      {
        fields: fields as any,
      },
    ]);

    return {
      id: records[0].id,
      fields: records[0].fields as AirtableUser["fields"],
    };
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

/**
 * Update a user
 */
export async function updateUser(
  id: string,
  fields: Partial<AirtableUser["fields"]>
): Promise<AirtableUser> {
  try {
    const record = await base(USERS_TABLE).update(id, {
      ...fields,
    } as any);

    return {
      id: record.id,
      fields: record.fields as AirtableUser["fields"],
    };
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// ==================== TRANSACTIONS TABLE ====================

export interface AirtableTransaction {
  id: string;
  fields: {
    // Purchase fields
    "Item #"?: string;
    "Deal Code"?: string;
    "Partner Name"?: string;
    "Deal Name"?: string;
    "Date - Purchases"?: string;
    "Quantity - Purchase"?: string;
    "Price per Unit - Purchases"?: string;
    "Total - Purchase Bill"?: string;
    "VAT on Purchases"?: string;
    "Payment Method - Purchases"?: string;
    "Paid Amount EFT - Purchases(Check)"?: string;
    "Paid Amount Cash - Purchases(Check)"?: string;
    "Transporter Name"?: string;
    "Transport Costs - Purchases/Unit"?: string;
    "Weight  - Purchases"?: string; // Note: double space in field name

    // Sales fields
    "Date - Sales"?: string;
    "Buyer Name"?: string;
    "Quantity - Sell"?: string;
    "Price per Unit - Sales"?: string;
    "Total - Sales Invoices"?: string;
    "VAT on Sales"?: string;
    "Payment Method - Sales"?: string;
    "Paid Amount EFT - Sales(Check)"?: string;
    "Paid Amount Cash - Sales(Check)"?: string;
    "Payment Notes"?: string;

    // Profit fields
    "Gross Profit"?: string;
    "Net Profit"?: string;
    "ROI %"?: string;
    "Partner %"?: string;
    "Partner Profit"?: string;
    "Digikraal %"?: string;
    "Digikraal Profit"?: string;
    "Investor Name"?: string;
    "Investor %"?: string;
    "Investor Profit"?: string;
    "Stock Available(Qty)"?: string;
    "Stock Value(R) - Not Sold Yet"?: string;
    "Days"?: string;
    "Type"?: string;

    [key: string]: any; // Allow for any other fields
  };
}

/**
 * Get all transactions (with optional filters)
 */
export async function getTransactions(filters?: {
  investorName?: string;
  partnerName?: string;
  dealCode?: string;
  dateFrom?: string;
  dateTo?: string;
}): Promise<AirtableTransaction[]> {
  try {
    let formula = "";
    const conditions: string[] = [];

    if (filters?.investorName) {
      conditions.push(`{Investor Name} = "${filters.investorName}"`);
    }
    if (filters?.partnerName) {
      conditions.push(`{Partner Name} = "${filters.partnerName}"`);
    }
    if (filters?.dealCode) {
      conditions.push(`{Deal Code} = "${filters.dealCode}"`);
    }
    if (filters?.dateFrom) {
      conditions.push(`IS_AFTER({Date - Sales}, "${filters.dateFrom}")`);
    }
    if (filters?.dateTo) {
      conditions.push(`IS_BEFORE({Date - Sales}, "${filters.dateTo}")`);
    }

    if (conditions.length > 0) {
      formula = `AND(${conditions.join(", ")})`;
    }

    const records: AirtableTransaction[] = [];
    await base(TRANSACTIONS_TABLE)
      .select({
        filterByFormula: formula || "",
        sort: [{ field: "Date - Sales", direction: "desc" }],
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach((record) => {
          records.push({
            id: record.id,
            fields: record.fields as AirtableTransaction["fields"],
          });
        });
        fetchNextPage();
      });

    return records;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}

/**
 * Get a transaction by Item #
 */
export async function getTransactionByItemNumber(
  itemNumber: string
): Promise<AirtableTransaction | null> {
  try {
    const records = await base(TRANSACTIONS_TABLE)
      .select({
        filterByFormula: `{Item #} = "${itemNumber}"`,
        maxRecords: 1,
      })
      .firstPage();

    if (records.length === 0) return null;

    return {
      id: records[0].id,
      fields: records[0].fields as AirtableTransaction["fields"],
    };
  } catch (error) {
    console.error("Error fetching transaction by Item #:", error);
    throw error;
  }
}

/**
 * Create a new transaction
 */
export async function createTransaction(
  fields: Partial<AirtableTransaction["fields"]>
): Promise<AirtableTransaction> {
  try {
    const records = await base(TRANSACTIONS_TABLE).create([
      {
        fields: fields as any,
      },
    ]);

    return {
      id: records[0].id,
      fields: records[0].fields as AirtableTransaction["fields"],
    };
  } catch (error) {
    console.error("Error creating transaction:", error);
    throw error;
  }
}

/**
 * Update a transaction
 */
export async function updateTransaction(
  id: string,
  fields: Partial<AirtableTransaction["fields"]>
): Promise<AirtableTransaction> {
  try {
    const record = await base(TRANSACTIONS_TABLE).update(id, {
      ...fields,
    } as any);

    return {
      id: record.id,
      fields: record.fields as AirtableTransaction["fields"],
    };
  } catch (error) {
    console.error("Error updating transaction:", error);
    throw error;
  }
}

