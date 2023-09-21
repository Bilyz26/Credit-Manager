interface HeaderProps {
    columns: string[];
    sortable?: boolean;
    onSort?: (selectedSort: {
      column: string;
      direction: "asc" | "desc" | "";
    }) => void;
    onAllSelectChecked?: (checked: boolean) => void;
    onAllDelete?: () => void;
  }
  
  function Header({
    columns,
    sortable = false,
    onSort,
    onAllSelectChecked,
    onAllDelete,
  }: HeaderProps) {
    const [sortColumn, setSortColumn] = useState("");
    const [sortDirection, setSortDirection] = useState<"asc" | "desc" | "">("");
  
    const handleSort = (column: string) => {
      if (sortable) {
        if (sortColumn === column) {
          // Toggle sorting direction
          const newDirection = sortDirection === "asc" ? "desc" : "asc";
          setSortDirection(newDirection);
          onSort?.({ column, direction: newDirection });
        } else {
          // Clicked a new column for sorting
          setSortColumn(column);
          setSortDirection("asc");
          onSort?.({ column, direction: "asc" });
        }
      }
    };
  
    const handleAllSelectChecked = (
      event: React.ChangeEvent<HTMLInputElement>
    ) => {
      onAllSelectChecked?.(event.target.checked);
    };
  
    const handleAllDelete = () => {
      onAllDelete?.();
    };
  
    return (
      <tr className="hover:bg-[rgb(245,245,245)] bg-[rgb(250,250,250)]">
        {columns.map((column, index) => (
          <th
            key={index}
            onClick={() => handleSort(column)}
            className="cursor-pointer"
          >
            <div className="flex w-full h-full justify-between items-center">
              {column}
              {sortable && (
                <div className="flex flex-col h-7">
                  {sortColumn === column && (
                    <>
                      <ChevronUp
                        className={`w-4 ${
                          sortDirection === "asc" ? "text-[#121212]" : ""
                        }`}
                      />
                      <ChevronDown
                        className={`w-4 ${
                          sortDirection === "desc" ? "text-[#121212]" : ""
                        }`}
                      />
                    </>
                  )}
                </div>
              )}
            </div>
          </th>
        ))}
        <th>
          <div className="flex justify-end gap-5 items-center">
            <div className="w-20 h-5 flex justify-end gap-5 pr-3 items-center">
              <HiTrash className="text-[#ccc]" onClick={handleAllDelete} />
            </div>
            <Checkbox onChange={handleAllSelectChecked} />
          </div>
        </th>
      </tr>
    );
  }
  
  function DataTable() {
    // Define your column names
    const columns = ["Client", "Debt Count", "Total Active", "Total Remaining"];
  
    // Function to handle sorting
    const handleSort = (selectedSort: {
      column: string;
      direction: "asc" | "desc" | "";
    }) => {
      // Implement your sorting logic here based on the selectedSort object
      console.log("Sorting:", selectedSort);
    };
  
    // Function to handle selecting all items
    const handleAllSelectChecked = (checked: boolean) => {
      // Implement your select all logic here
      console.log("Select All Checked:", checked);
    };
  
    // Function to handle deleting all items
    const handleAllDelete = () => {
      // Implement your delete all logic here
      console.log("Delete All");
    };
  
    return (
      <div className="flex flex-col gap-3">
        <div className="px-2 flex justify-start gap-3">
          <div>
            {/* Pass the columns and sorting callbacks to Header */}
            <Header
              columns={columns}
              sortable={true}
              onSort={(selectedSort) => handleSort(selectedSort)}
              onAllSelectChecked={(checked) => handleAllSelectChecked(checked)}
              onAllDelete={() => handleAllDelete()}
            />
          </div>
        </div>
        {/* Rest of your DataTable content */}
      </div>
    );
  }
  
  export default DataTable;
  