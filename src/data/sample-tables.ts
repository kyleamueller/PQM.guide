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
};
