import { SampleTable } from "@/lib/types";

export const sampleTables: Record<string, SampleTable> = {
  Sales: {
    id: "Sales",
    displayName: "Sales",
    description: "Sample sales order data",
    data: {
      columns: [
        { name: "OrderID", type: "number" },
        { name: "CustomerName", type: "text" },
        { name: "Product", type: "text" },
        { name: "Category", type: "text" },
        { name: "UnitPrice", type: "number" },
        { name: "Quantity", type: "number" },
        { name: "OrderDate", type: "date" },
        { name: "Region", type: "text" },
      ],
      rows: [
        { OrderID: 1, CustomerName: "Alice", Product: "Widget A", Category: "Widgets", UnitPrice: 25.00, Quantity: 4, OrderDate: "2024-01-15", Region: "East" },
        { OrderID: 2, CustomerName: "Bob", Product: "Gadget B", Category: "Gadgets", UnitPrice: 50.00, Quantity: 2, OrderDate: "2024-01-18", Region: "West" },
        { OrderID: 3, CustomerName: "Charlie", Product: "Widget C", Category: "Widgets", UnitPrice: 15.00, Quantity: 10, OrderDate: "2024-02-01", Region: "East" },
        { OrderID: 4, CustomerName: "Alice", Product: "Gadget D", Category: "Gadgets", UnitPrice: 75.00, Quantity: 1, OrderDate: "2024-02-10", Region: "North" },
        { OrderID: 5, CustomerName: "Diana", Product: "Widget A", Category: "Widgets", UnitPrice: 25.00, Quantity: 6, OrderDate: "2024-03-05", Region: "West" },
        { OrderID: 6, CustomerName: "Bob", Product: "Thingamajig E", Category: "Misc", UnitPrice: 120.00, Quantity: 1, OrderDate: "2024-03-12", Region: "East" },
        { OrderID: 7, CustomerName: "Charlie", Product: "Gadget B", Category: "Gadgets", UnitPrice: 50.00, Quantity: 3, OrderDate: "2024-04-01", Region: "West" },
        { OrderID: 8, CustomerName: "Diana", Product: "Widget C", Category: "Widgets", UnitPrice: 15.00, Quantity: 8, OrderDate: "2024-04-15", Region: "North" },
      ],
    },
  },
  Customers: {
    id: "Customers",
    displayName: "Customers",
    description: "Sample customer data",
    data: {
      columns: [
        { name: "CustomerID", type: "number" },
        { name: "Name", type: "text" },
        { name: "Email", type: "text" },
        { name: "City", type: "text" },
        { name: "State", type: "text" },
        { name: "JoinDate", type: "date" },
      ],
      rows: [
        { CustomerID: 1, Name: "Alice", Email: "alice@example.com", City: "New York", State: "NY", JoinDate: "2022-03-15" },
        { CustomerID: 2, Name: "Bob", Email: "bob@example.com", City: "Chicago", State: "IL", JoinDate: "2022-06-01" },
        { CustomerID: 3, Name: "Charlie", Email: "charlie@example.com", City: "Houston", State: "TX", JoinDate: "2023-01-20" },
        { CustomerID: 4, Name: "Diana", Email: "diana@example.com", City: "Seattle", State: "WA", JoinDate: "2023-09-10" },
      ],
    },
  },
  Products: {
    id: "Products",
    displayName: "Products",
    description: "Sample product catalog",
    data: {
      columns: [
        { name: "ProductID", type: "number" },
        { name: "ProductName", type: "text" },
        { name: "Category", type: "text" },
        { name: "Price", type: "number" },
        { name: "InStock", type: "logical" },
      ],
      rows: [
        { ProductID: 1, ProductName: "Widget A", Category: "Widgets", Price: 25.00, InStock: true },
        { ProductID: 2, ProductName: "Gadget B", Category: "Gadgets", Price: 50.00, InStock: true },
        { ProductID: 3, ProductName: "Widget C", Category: "Widgets", Price: 15.00, InStock: false },
        { ProductID: 4, ProductName: "Gadget D", Category: "Gadgets", Price: 75.00, InStock: true },
        { ProductID: 5, ProductName: "Thingamajig E", Category: "Misc", Price: 120.00, InStock: false },
      ],
    },
  },
  Employees: {
    id: "Employees",
    displayName: "Employees",
    description: "Sample employee directory with mixed-case names and phone numbers",
    data: {
      columns: [
        { name: "EmployeeID", type: "text" },
        { name: "FullName", type: "text" },
        { name: "Department", type: "text" },
        { name: "Title", type: "text" },
        { name: "HireDate", type: "date" },
        { name: "Salary", type: "number" },
        { name: "Phone", type: "text" },
      ],
      rows: [
        { EmployeeID: "E001", FullName: "alice smith", Department: "Sales", Title: "Sales Rep", HireDate: "2021-03-15", Salary: 55000, Phone: "(555) 123-4567" },
        { EmployeeID: "E002", FullName: "BOB JONES", Department: "Engineering", Title: "Sr. Engineer", HireDate: "2019-07-01", Salary: 95000, Phone: "(555) 234-5678" },
        { EmployeeID: "E003", FullName: "Charlie Brown", Department: "Marketing", Title: "Marketing Lead", HireDate: "2022-01-10", Salary: 72000, Phone: "(555) 345-6789" },
        { EmployeeID: "E004", FullName: "diana PRINCE", Department: "Engineering", Title: "Engineer", HireDate: "2023-06-20", Salary: 68000, Phone: "(555) 456-7890" },
        { EmployeeID: "E005", FullName: "Eve Martinez", Department: "Sales", Title: "Sales Manager", HireDate: "2018-11-05", Salary: 88000, Phone: "(555) 567-8901" },
        { EmployeeID: "E006", FullName: "frank lee", Department: "Marketing", Title: "Analyst", HireDate: "2024-02-14", Salary: 52000, Phone: "(555) 678-9012" },
      ],
    },
  },
  OrderLog: {
    id: "OrderLog",
    displayName: "OrderLog",
    description: "Sample order event log with timestamps and durations",
    data: {
      columns: [
        { name: "LogID", type: "text" },
        { name: "OrderID", type: "number" },
        { name: "Action", type: "text" },
        { name: "Timestamp", type: "datetime" },
        { name: "DurationMinutes", type: "number" },
        { name: "Notes", type: "text" },
      ],
      rows: [
        { LogID: "L001", OrderID: 1, Action: "Created", Timestamp: "2024-01-15T09:30:00", DurationMinutes: null, Notes: "New order: Widget A" },
        { LogID: "L002", OrderID: 1, Action: "Shipped", Timestamp: "2024-01-16T14:15:00", DurationMinutes: 1725, Notes: "Shipped via express" },
        { LogID: "L003", OrderID: 2, Action: "Created", Timestamp: "2024-01-18T11:00:00", DurationMinutes: null, Notes: "New order: Gadget B" },
        { LogID: "L004", OrderID: 2, Action: "Shipped", Timestamp: "2024-01-20T08:45:00", DurationMinutes: 2745, Notes: "Standard shipping" },
        { LogID: "L005", OrderID: 3, Action: "Created", Timestamp: "2024-02-01T16:20:00", DurationMinutes: null, Notes: "New order: Widget C" },
        { LogID: "L006", OrderID: 3, Action: "Cancelled", Timestamp: "2024-02-02T10:05:00", DurationMinutes: 1065, Notes: "Customer request" },
        { LogID: "L007", OrderID: 4, Action: "Created", Timestamp: "2024-02-10T13:00:00", DurationMinutes: null, Notes: "New order: Gadget D" },
        { LogID: "L008", OrderID: 4, Action: "Shipped", Timestamp: "2024-02-12T09:30:00", DurationMinutes: 2670, Notes: "Shipped via express" },
      ],
    },
  },
};
