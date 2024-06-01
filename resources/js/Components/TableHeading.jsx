import React from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";

const TableHeading = ({
    sort_field = null,
    sort_direction = null,
    name,
    sortChanged = () => {},
    children,
    sortable = true,
}) => {
    return (
        <th onClick={(e) => sortChanged(name)}>
            <div className="px-3 py-3 flex items-center justify-between gap-1 cursor-pointer">
                {children}
                {sortable && (
                    <div>
                        <ChevronUpIcon
                            className={`w-4 ${
                                sort_field === name && sort_direction == "asc"
                                    ? "text-white"
                                    : ""
                            }`}
                        />
                        <ChevronDownIcon
                            className={`w-4 ${
                                sort_field === name && sort_direction == "desc"
                                    ? "text-white"
                                    : ""
                            } -mt-2`}
                        />
                    </div>
                )}
            </div>
        </th>
    );
};

export default TableHeading;
