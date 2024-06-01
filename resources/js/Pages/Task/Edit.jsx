import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import TextAreaInput from "@/Components/TextAreaInput";
import SelectInput from "@/Components/SelectInput";

const Edit = ({ auth, projects, task }) => {
    const { data, setData, post, errors, reset } = useForm({
        image: null,
        name: task.name,
        status: task.status,
        description: task.description,
        due_date: task.due_date,
        priority: task.priority,
        project_id: task.project_id,
        _method: "PUT",
    });
    const onSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        post(route("task.update", task.id));
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Task
                    </h2>
                </div>
            }
        >
            <Head title="Edit Task" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg"
                            encType="multipart/form-data"
                        >
                            {task.image_path && (
                                <div className="my-4">
                                    <img
                                        src={task.image_path}
                                        alt={task.image_path}
                                        className="w-full h-64 object-cover"
                                    />
                                </div>
                            )}
                            <div className="my-2">
                                <InputLabel
                                    htmlFor="task_image_path"
                                    value="Task Image"
                                />
                                <TextInput
                                    id="task_image_path"
                                    type="file"
                                    name="task_image_path"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("image", e.target.files[0])
                                    }
                                />
                                <InputError
                                    message={errors.image}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="task_name"
                                    value="Task Name"
                                />
                                <TextInput
                                    id="task_name"
                                    name="task_name"
                                    placeholder="Task name"
                                    value={data.name}
                                    isFocused={true}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="task_description"
                                    value="Task Description"
                                />
                                <TextAreaInput
                                    id="task_description"
                                    name="task_description"
                                    placeholder="Task Description"
                                    value={data.description}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                ></TextAreaInput>
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-2">
                                <InputLabel
                                    htmlFor="task_due_date"
                                    value="Task Due Date"
                                />
                                <TextInput
                                    id="task_due_date"
                                    type="date"
                                    name="task_due_date"
                                    value={data.due_date}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("due_date", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.due_date}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="task_status"
                                    value="Task Status"
                                />
                                <SelectInput
                                    id="task_status"
                                    name="task_status"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                    value={data.status}
                                >
                                    <option value="" disabled selected>
                                        Please Select
                                    </option>
                                    <option value="completed">Completed</option>
                                    <option value="in_progress">
                                        In Progress
                                    </option>
                                    <option value="pending">Pending</option>
                                </SelectInput>
                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="task_priority"
                                    value="Task Priority"
                                />
                                <SelectInput
                                    id="task_priority"
                                    name="task_priority"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("priority", e.target.value)
                                    }
                                    value={data.priority}
                                >
                                    <option value="" disabled selected>
                                        Please Select
                                    </option>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </SelectInput>
                                <InputError
                                    message={errors.priority}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3">
                                <InputLabel
                                    htmlFor="task_project_id"
                                    value="Task Project ID"
                                />
                                <SelectInput
                                    id="task_project_id"
                                    name="task_project_id"
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("project_id", e.target.value)
                                    }
                                    value={data.project_id}
                                >
                                    <option value="" disabled selected>
                                        Please Select
                                    </option>

                                    {projects.data.map((project, index) => (
                                        <option
                                            value={project.id}
                                            key={`project-${index}`}
                                        >
                                            {project.name}
                                        </option>
                                    ))}
                                </SelectInput>
                                <InputError
                                    message={errors.project_id}
                                    className="mt-2"
                                />
                            </div>
                            <div className="my-3 text-right">
                                <button className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600 mr-2 text-sm">
                                    Submit
                                </button>
                                <Link route={route("task.index")}>
                                    <button className="bg-gray-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-gray-600 mr-2 text-sm">
                                        Cancel
                                    </button>
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
