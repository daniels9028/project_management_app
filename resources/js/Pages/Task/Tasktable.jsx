import React from "react";
import TableHeading from "@/Components/TableHeading";
import { Link, router } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from "@/constants";
import Pagination from "@/Components/Pagination";

const Tasktable = ({
    tasks,
    success,
    queryParams = null,
    hideProjectColumn = false,
    project,
}) => {
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("project.show", project.id), queryParams);
    };

    const onKeyPress = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (
            name === queryParams.sort_field &&
            queryParams.sort_direction === "asc"
        ) {
            queryParams.sort_direction = "desc";
        } else if (
            name === queryParams.sort_field &&
            queryParams.sort_direction === "desc"
        ) {
            queryParams.sort_direction = "asc";
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }

        router.get(route("project.show", project.id), queryParams);
    };

    return (
        <>
            <div className="overflow-auto">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                        <tr className="text-nowrap">
                            <TableHeading
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                name="id"
                                sortChanged={sortChanged}
                            >
                                ID
                            </TableHeading>
                            <th>
                                <div className="px-3 py-3">Image</div>
                            </th>
                            {!hideProjectColumn && (
                                <th>
                                    <div className="px-3 py-3">
                                        Project Name
                                    </div>
                                </th>
                            )}
                            <TableHeading
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                name="name"
                                sortChanged={sortChanged}
                            >
                                Name
                            </TableHeading>
                            <TableHeading
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                name="status"
                                sortChanged={sortChanged}
                            >
                                Status
                            </TableHeading>
                            <TableHeading
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                name="created_at"
                                sortChanged={sortChanged}
                            >
                                Created At
                            </TableHeading>
                            <TableHeading
                                sort_field={queryParams.sort_field}
                                sort_direction={queryParams.sort_direction}
                                name="due_date"
                                sortChanged={sortChanged}
                            >
                                Due Date
                            </TableHeading>
                            <th>
                                <div className="px-3 py-3">Created By</div>
                            </th>
                            <th>
                                <div className="px-3 py-3">Actions</div>
                            </th>
                        </tr>
                        <tr className="text-nowrap">
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            {!hideProjectColumn && (
                                <th className="px-3 py-3"></th>
                            )}
                            <th className="px-3 py-3">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name}
                                    placeholder="Project name"
                                    onBlur={(e) =>
                                        searchFieldChanged(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={(e) => onKeyPress("name", e)}
                                />
                            </th>
                            <th className="px-3 py-3">
                                <SelectInput
                                    className="w-full"
                                    defaultValue={queryParams.status}
                                    onChange={(e) =>
                                        searchFieldChanged(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="" disabled selected>
                                        Select Status
                                    </option>
                                    <option value="pending">Pending</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="completed">Completed</option>
                                </SelectInput>
                            </th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                            <th className="px-3 py-3"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.data.map((task, index) => (
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-3 py-2">{task.id}</td>
                                <td className="px-3 py-2">
                                    <img
                                        src={task.image_path}
                                        alt={task.image_path}
                                        width={50}
                                    />
                                </td>
                                {!hideProjectColumn && (
                                    <td className="px-3 py-2">
                                        {task.project.name}
                                    </td>
                                )}
                                <td className="px-3 py-2">{task.name}</td>
                                <td className="px-3 py-2">
                                    <span
                                        className={
                                            "px-2 py-1 rounded text-white " +
                                            PROJECT_STATUS_CLASS_MAP[
                                                task.status
                                            ]
                                        }
                                    >
                                        {PROJECT_STATUS_TEXT_MAP[task.status]}
                                    </span>
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    {task.created_at}
                                </td>
                                <td className="px-3 py-2 text-nowrap">
                                    {task.due_date}
                                </td>
                                <td className="px-3 py-2">
                                    {task.createdBy.name}
                                </td>
                                <td className="px-3 py-2">
                                    <Link
                                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                        href={route("task.edit", task.id)}
                                    >
                                        Edit
                                    </Link>
                                    <Link
                                        className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                        href={route("task.destroy", task.id)}
                                    >
                                        Delete
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Pagination links={tasks.meta.links} />
        </>
    );
};

export default Tasktable;
